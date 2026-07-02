const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const path = require('path');
const LegacyClient = require('../models/LegacyClient');
const User = require('../models/User');

const ALLOWED_COLUMN_ALIASES = {
  full_name: ['full_name', 'name', 'FullName', 'Name', 'nom', 'fullname', 'client_name', 'customer_name'],
  phone: ['phone', 'Phone', 'telephone', 'Telephone', 'tel', 'mobile', 'Mobile', 'cell', 'Cell', 'contact'],
  email: ['email', 'Email', 'mail', 'Mail', 'e-mail', 'E-mail'],
  past_membership: ['past_membership', 'pastMembership', 'membership', 'Membership', 'plan', 'Plan', 'program', 'Program', 'subscription'],
  membership_start: ['membership_start', 'membershipStart', 'start_date', 'startDate', 'start', 'Start', 'from_date'],
  membership_end: ['membership_end', 'membershipEnd', 'end_date', 'endDate', 'end', 'End', 'to_date'],
  total_spent: ['total_spent', 'totalSpent', 'spent', 'Spent', 'amount', 'Amount', 'total', 'Total', 'revenue'],
  notes: ['notes', 'Notes', 'comment', 'Comment', 'remarks'],
};

function normalizeColumns(row) {
  const normalized = {};
  const seen = {};

  for (const [key, aliases] of Object.entries(ALLOWED_COLUMN_ALIASES)) {
    for (const alias of aliases) {
      if (row[alias] !== undefined && !seen[key]) {
        normalized[key] = row[alias];
        seen[key] = true;
      }
    }
  }
  return normalized;
}

function validateRow(row, index) {
  const errors = [];

  if (!row.full_name || String(row.full_name).trim() === '') {
    errors.push(`Row ${index}: full_name is missing`);
  }

  const phone = String(row.phone || '').replace(/[^0-9+]/g, '');
  if (!phone) {
    errors.push(`Row ${index}: phone is missing or invalid`);
  } else if (phone.length < 7) {
    errors.push(`Row ${index}: phone "${phone}" is too short`);
  }

  if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    errors.push(`Row ${index}: email "${row.email}" is invalid`);
  }

  return { valid: errors.length === 0, errors, cleanedPhone: phone };
}

async function importCsv(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Send a .csv, .xlsx, or .xls file.' });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const importedBy = req.user?.id;
    let records = [];

    try {
      if (ext === '.csv') {
        records = await parseCsv(filePath);
      } else if (ext === '.xlsx' || ext === '.xls') {
        records = parseExcel(filePath);
      } else {
        fs.unlink(filePath, () => {});
        return res.status(400).json({ error: `Unsupported file type: ${ext}. Use .csv, .xlsx, or .xls` });
      }
    } catch (parseErr) {
      fs.unlink(filePath, () => {});
      return res.status(400).json({ error: `Failed to parse file: ${parseErr.message}` });
    }

    if (!records || records.length === 0) {
      fs.unlink(filePath, () => {});
      return res.status(400).json({ error: 'File is empty or has no readable rows' });
    }

    const validationResults = records.map((r, i) => {
      const normalized = normalizeColumns(r);
      const validation = validateRow(normalized, i + 2);
      return { raw: r, normalized, validation };
    });

    const validRows = validationResults.filter(v => v.validation.valid);
    const invalidRows = validationResults.filter(v => !v.validation.valid);

    const sanitized = validRows.map(v => ({
      full_name: String(v.normalized.full_name).trim(),
      phone: v.validation.cleanedPhone,
      email: v.normalized.email || '',
      past_membership: v.normalized.past_membership || '',
      membership_start: v.normalized.membership_start || null,
      membership_end: v.normalized.membership_end || null,
      total_spent: parseFloat(v.normalized.total_spent) || 0,
      notes: v.normalized.notes || '',
      imported_by: importedBy,
    }));

    const duplicates = [];
    const uniqueRows = [];

    for (const row of sanitized) {
      const existing = await LegacyClient.findByPhone(row.phone);
      if (existing && existing.matched_user_id) {
        duplicates.push({ phone: row.phone, full_name: row.full_name, reason: 'Already linked to user' });
      } else {
        uniqueRows.push(row);
      }
    }

    const inserted = await LegacyClient.bulkCreate(uniqueRows);

    fs.unlink(filePath, () => {});

    const summary = {
      message: `Successfully imported ${inserted.length} of ${records.length} records.`,
      total_in_file: records.length,
      valid: validRows.length,
      invalid: invalidRows.length,
      duplicates_skipped: duplicates.length,
      imported: inserted.length,
      validation_errors: invalidRows.map(v => v.validation.errors),
      duplicate_details: duplicates,
    };

    const statusCode = inserted.length > 0 ? 201 : 200;
    res.status(statusCode).json(summary);
  } catch (err) {
    console.error('Import CSV error:', err);
    res.status(500).json({ error: 'Import failed', details: err.message });
  }
}

async function previewImport(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    let records = [];

    try {
      if (ext === '.csv') records = await parseCsv(filePath);
      else records = parseExcel(filePath);
    } catch (parseErr) {
      fs.unlink(filePath, () => {});
      return res.status(400).json({ error: `Parse error: ${parseErr.message}` });
    }

    fs.unlink(filePath, () => {});

    const preview = records.slice(0, 10).map((r, i) => {
      const normalized = normalizeColumns(r);
      const validation = validateRow(normalized, i + 2);
      return { row: i + 2, normalized, valid: validation.valid, errors: validation.errors };
    });

    res.json({
      total_rows: records.length,
      columns: records.length > 0 ? Object.keys(records[0]) : [],
      preview,
      warnings: detectWarnings(records, preview),
    });
  } catch (err) {
    console.error('Preview error:', err);
    res.status(500).json({ error: 'Preview failed' });
  }
}

function detectWarnings(allRecords, previewRows) {
  const warnings = [];
  if (allRecords.length > 1000) {
    warnings.push(`Large file: ${allRecords.length} rows. Import may take time.`);
  }
  const invalidCount = previewRows.filter(r => !r.valid).length;
  if (invalidCount > 0) {
    warnings.push(`${invalidCount} of first 10 rows have validation errors.`);
  }
  return warnings;
}

async function getStats(req, res) {
  try {
    const stats = await LegacyClient.getStats();
    res.json(stats);
  } catch (err) {
    console.error('Legacy stats error:', err);
    res.status(500).json({ error: 'Failed to get stats' });
  }
}

async function getUnlinked(req, res) {
  try {
    const clients = await LegacyClient.findUnlinked();
    res.json({ legacy_clients: clients, count: clients.length });
  } catch (err) {
    console.error('Get unlinked error:', err);
    res.status(500).json({ error: 'Failed to get unlinked records' });
  }
}

function parseCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv({ skipEmptyLines: true, trim: true }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

function parseExcel(filePath) {
  const workbook = xlsx.readFile(filePath, { cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = xlsx.utils.sheet_to_json(sheet, { defval: '', blankrows: false });
  return json;
}

module.exports = { importCsv, previewImport, getStats, getUnlinked };
