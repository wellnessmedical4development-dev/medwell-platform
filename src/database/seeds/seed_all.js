require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '..', '.env') });
const { pool, query } = require('../../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function seed() {
  try {
    const hash = await bcrypt.hash('Admin@123456', 12);
    const clientHash = await bcrypt.hash('Client@123456', 12);
    const adminId = crypto.randomUUID();
    const clientId = crypto.randomUUID();

    // Admin user
    await query(`
      INSERT INTO users (id, unique_id, role, first_name, last_name, email, phone, password_hash, preferred_lang, subscription_status)
      VALUES (?, ?, 'admin', 'MedWell', 'Administrator', ?, ?, ?, 'en', 'active')
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)
    `, [adminId, 'MW-ADMIN-001', 'admin@medwell.ma', '+212600000000', hash]);
    console.log('Admin user seeded: admin@medwell.ma / Admin@123456');

    // Demo client user
    await query(`
      INSERT INTO users (id, unique_id, role, first_name, last_name, email, phone, password_hash, preferred_lang, subscription_status, wellness_coin_balance)
      VALUES (?, ?, 'client', 'John', 'Doe', ?, ?, ?, 'en', 'active', 250.00)
      ON DUPLICATE KEY UPDATE first_name = VALUES(first_name)
    `, [clientId, 'MW-000001', 'john.doe@example.com', '+212600000001', clientHash]);
    console.log('Demo client seeded: john.doe@example.com / Client@123456');

    // Services
    const services = [
      {
        code: 'NUTRITION-ACCOMP',
        title: { en: 'Nutrition & Guidance', fr: 'Nutrition & Accompagnement', es: 'Nutrición y Acompañamiento', ar: 'التغذية والمرافقة' },
        desc: { en: 'Personalized metabolic rebalancing and micronutrition counseling', fr: 'Rééquilibrage métabolique personnalisé et conseil en micronutrition', es: 'Reequilibrio metabólico personalizado y asesoramiento en micronutrición', ar: 'إعادة التوازن الأيضي الشخصي واستشارات التغذية الدقيقة' },
        price: 450,
        days: 30,
        reward: 45,
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'
      },
      {
        code: 'KINESITHERAPIE',
        title: { en: 'Physiotherapy & Recovery', fr: 'Kinésithérapie', es: 'Fisioterapia', ar: 'العلاج الطبيعي' },
        desc: { en: 'Professional physical therapy and rehabilitation treatments', fr: 'Thérapie physique professionnelle et soins de réhabilitation', es: 'Terapia física profesional y tratamientos de rehabilitación', ar: 'العلاج الطبيعي المهني وعلاجات إعادة التأهيل' },
        price: 350,
        days: 15,
        reward: 35,
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80'
      },
      {
        code: 'I-SLIM',
        title: { en: 'I-SLIM Electro-Stimulation', fr: 'I-SLIM Électro-stimulation', es: 'I-SLIM Electroestimulación', ar: 'تحفيز العضلات الكهربائي I-SLIM' },
        desc: { en: 'High-tech muscle toning and active body sculpting sessions', fr: 'Tonification musculaire de pointe et remodelage actif de la silhouette', es: 'Tonificación muscular de alta tecnología y modelado corporal activo', ar: 'تقوية العضلات عالية التقنية ونحت الجسم النشط' },
        price: 600,
        days: 30,
        reward: 60,
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80'
      },
      {
        code: 'AMINCISSEMENT',
        title: { en: 'Slimming & Body Contouring', fr: 'Amincissement & Minceur', es: 'Adelgazamiento y Moldeo', ar: 'التخسيس والتنحيف' },
        desc: { en: 'Advanced body contouring therapies using state-of-the-art systems', fr: 'Thérapies minceur avancées utilisant des technologies de pointe', es: 'Terapias de modelado corporal avanzadas utilizando tecnologías de vanguardia', ar: 'علاجات نحت الجسم المتقدمة باستخدام أحدث التقنيات' },
        price: 800,
        days: 30,
        reward: 80,
        image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80'
      },
      {
        code: 'FITNESS-PROG',
        title: { en: 'Fitness', fr: 'Fitness', ar: 'اللياقة البدنية', es: 'Fitness' },
        desc: { en: 'Premium resort gym access and personalized coaching', fr: 'Salle de sport de prestige et accompagnement premium', ar: 'صالة رياضية متميزة وتدريب شخصي', es: 'Gimnasio premium y entrenamiento personal' },
        price: 400,
        days: 30,
        reward: 40,
        image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=600&q=80'
      },
      {
        code: 'ESTHETIQUE',
        title: { en: 'Aesthetics & Anti-Aging', fr: 'Esthétique', es: 'Estética', ar: 'العناية بالجمال' },
        desc: { en: 'Luxury facial rejuvenation and non-invasive medical aesthetic care', fr: 'Rajeunissement facial de luxe et soins esthétiques non invasifs', es: 'Rejuvenecimiento facial de lujo y cuidado estético no invasivo', ar: 'علاجات فاخرة لتجديد شباب الوجه والعناية التجميلية غير الجراحية' },
        price: 750,
        days: 30,
        reward: 75,
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'
      },
      {
        code: 'SPA-HAMMAM',
        title: { en: 'Luxury SPA & Hammam', fr: 'SPA & Hammam', es: 'SPA y Hammam', ar: 'السبا والحمام المغربي' },
        desc: { en: 'Premium thermal relaxation and traditional therapeutic bathing', fr: 'Détente thermique haut de gamme et rituels traditionnels de bain', es: 'Relajación térmica de primera clase y rituales tradicionales de baño', ar: 'استرخاء حراري فاخر وطقوس الاستحمام التقليدية' },
        price: 400,
        days: 1,
        reward: 40,
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
      }
    ];

    for (const s of services) {
      const serviceId = crypto.randomUUID();
      await query(`
        INSERT INTO services (id, code, title, description, price, currency, duration_days, is_active, wellness_coin_reward, image_url)
        VALUES (?, ?, ?, ?, ?, 'MAD', ?, TRUE, ?, ?)
        ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description), price = VALUES(price), duration_days = VALUES(duration_days), wellness_coin_reward = VALUES(wellness_coin_reward), image_url = VALUES(image_url)
      `, [serviceId, s.code, JSON.stringify(s.title), JSON.stringify(s.desc), s.price, s.days, s.reward, s.image]);
    }
    console.log('Services seeded.');

    console.log('Seed complete!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await pool.end();
  }
}

seed();
