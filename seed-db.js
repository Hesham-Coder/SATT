const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Seeding database with transformed content...');

    // 1. ALEX-CPC Conference
    await prisma.conference.upsert({
      where: { id: 'fb-event-01' },
      update: {},
      create: {
        id: 'fb-event-01',
        title: 'Bridging Medicine and Community: The 16th Annual ALEX-CPC Conference',
        titleEn: 'Bridging Medicine and Community: The 16th Annual ALEX-CPC Conference',
        titleAr: 'جسر الطب والمجتمع: مؤتمر أليكس سي بي سي السنوي السادس عشر',
        description: 'Discover how the 16th Annual ALEX-CPC Conference united oncology professionals and social work leaders to enhance charitable support for cancer patients in Egypt.',
        descriptionEn: 'Discover how the 16th Annual ALEX-CPC Conference united oncology professionals and social work leaders to enhance charitable support for cancer patients in Egypt.',
        descriptionAr: 'اكتشف كيف جمع مؤتمر أليكس سي بي سي السنوي السادس عشر بين متخصصي الأورام وقادة العمل الاجتماعي لتعزيز الدعم الخيري لمرضى السرطان في مصر.',
        fullDescription: '<h3>Uniting for a Shared Cause</h3><p>The journey through cancer treatment is rarely walked alone. It requires a robust network of medical expertise, emotional guidance, and profound community support. Recognizing this essential synergy, the Scientific Association for Targeted Therapy (SATT) proudly highlights the achievements of the 16th Annual Conference of the Alexandria Cancer Patient Care Society (ALEX-CPC).</p><h3>The Role of Charitable Organizations in Oncology</h3><p>This year\'s conference placed a spotlight on a vital, yet sometimes overlooked, pillar of patient care: charitable organizations. Medical treatments, while advanced, often bring significant financial and emotional burdens. Charities step into this gap, providing essential resources, funding for targeted therapies, and psychological support systems that are crucial for patient recovery and resilience.</p><p>During the event, prominent leaders in Egyptian social work and oncology gathered to discuss innovative strategies for integrating charitable efforts directly into clinical care pathways.</p><h3>Fostering Collaborative Care</h3><p>The core message of the 16th Annual ALEX-CPC Conference was clear: early detection and advanced treatment must go hand-in-hand with robust community support. By aligning the efforts of non-profit organizations with those of medical professionals, the oncology community in Egypt is building a more comprehensive, compassionate safety net for patients.</p><h3>Looking Forward</h3><p>As we continue to push the boundaries of cancer treatment and precision oncology, the partnerships forged at events like ALEX-CPC remind us that true healing encompasses both the physical and the emotional. We invite all healthcare professionals and community leaders to join us in supporting these charitable initiatives, ensuring that no patient has to face cancer alone.</p>',
        date: '2024-04-29',
        location: 'Alexandria, Egypt',
        locationEn: 'Alexandria, Egypt',
        locationAr: 'الإسكندرية، مصر',
        categoryKey: 'conference',
        categoryEn: 'Conference',
        categoryAr: 'مؤتمر',
        images: JSON.stringify(['/uploads/alex-cpc-conference.png']),
        videos: JSON.stringify([]),
        tags: JSON.stringify(['oncology', 'charity', 'alexandria']),
        tagsEn: JSON.stringify(['Oncology', 'Charity', 'Alexandria']),
        tagsAr: JSON.stringify(['الأورام', 'العمل الخيري', 'الإسكندرية']),
      },
    });

    // 2. Breast Cancer Symptoms Guide
    await prisma.researchArticle.upsert({
      where: { id: 'fb-article-02' },
      update: {},
      create: {
        id: 'fb-article-02',
        title: 'Recognizing the Signs: A Guide to Breast Cancer Symptoms',
        titleEn: 'Recognizing the Signs: A Guide to Breast Cancer Symptoms',
        titleAr: 'التعرف على العلامات: دليل لأعراض سرطان الثدي',
        abstract: 'Learn how to identify the early warning signs of breast cancer. Early detection is your strongest defense. Discover what changes to look for during self-exams.',
        abstractEn: 'Learn how to identify the early warning signs of breast cancer. Early detection is your strongest defense. Discover what changes to look for during self-exams.',
        abstractAr: 'تعرف على كيفية تحديد علامات الإنذار المبكر لسرطان الثدي. الكشف المبكر هو أقوى دفاع لك. اكتشف التغييرات التي يجب البحث عنها أثناء الفحص الذاتي.',
        author: 'SATT Education Team',
        authorEn: 'SATT Education Team',
        authorAr: 'فريق التثقيف في الجمعية',
        publishDate: '2024-04-29',
        category: 'Awareness',
        categoryEn: 'Awareness',
        categoryAr: 'توعية',
        content: '<h3>The Importance of Body Awareness</h3><p>When it comes to breast cancer, time is one of the most critical factors in treatment success. Recognizing the early signs and symptoms can lead to a prompt diagnosis, significantly improving the chances of a full recovery. At SATT, one of our most frequently asked questions revolves around identifying these warning signs. Education is the first step toward prevention.</p><h3>What to Look For</h3><p>Breast tissue naturally changes over time, but certain abnormalities require immediate medical evaluation. While the presence of a lump is the most widely known symptom, it is not the only indicator. You should be vigilant for the following changes:</p><ul><li><strong>Palpable Lumps:</strong> The development of a hard, distinct, and often painless lump beneath the skin in the breast or underarm area.</li><li><strong>Visual Changes in Size or Shape:</strong> Any unexplained swelling, shrinkage, or noticeable asymmetry.</li><li><strong>Skin Alterations:</strong> Changes in the skin\'s texture, such as dimpling, puckering, redness, or a rash that resembles an orange peel.</li><li><strong>Nipple Abnormalities:</strong> Nipple retraction (turning inward), sudden pain, or unusual discharge (especially if yellow or bloody).</li><li><strong>Temperature and Sensation:</strong> An unexplained feeling of heaviness, localized warmth, or persistent discomfort.</li></ul><h3>Taking Action</h3><p>If you notice any of these symptoms, do not panic, but do not delay. Many breast abnormalities are benign, but only a specialized oncologist can provide a definitive diagnosis. We strongly encourage regular self-examinations and scheduled mammograms. Early detection is not just a medical phrase; it is a life-saving practice.</p>',
        contentEn: '<h3>The Importance of Body Awareness</h3><p>When it comes to breast cancer, time is one of the most critical factors in treatment success. Recognizing the early signs and symptoms can lead to a prompt diagnosis, significantly improving the chances of a full recovery. At SATT, one of our most frequently asked questions revolves around identifying these warning signs. Education is the first step toward prevention.</p><h3>What to Look For</h3><p>Breast tissue naturally changes over time, but certain abnormalities require immediate medical evaluation. While the presence of a lump is the most widely known symptom, it is not the only indicator. You should be vigilant for the following changes:</p><ul><li><strong>Palpable Lumps:</strong> The development of a hard, distinct, and often painless lump beneath the skin in the breast or underarm area.</li><li><strong>Visual Changes in Size or Shape:</strong> Any unexplained swelling, shrinkage, or noticeable asymmetry.</li><li><strong>Skin Alterations:</strong> Changes in the skin\'s texture, such as dimpling, puckering, redness, or a rash that resembles an orange peel.</li><li><strong>Nipple Abnormalities:</strong> Nipple retraction (turning inward), sudden pain, or unusual discharge (especially if yellow or bloody).</li><li><strong>Temperature and Sensation:</strong> An unexplained feeling of heaviness, localized warmth, or persistent discomfort.</li></ul><h3>Taking Action</h3><p>If you notice any of these symptoms, do not panic, but do not delay. Many breast abnormalities are benign, but only a specialized oncologist can provide a definitive diagnosis. We strongly encourage regular self-examinations and scheduled mammograms. Early detection is not just a medical phrase; it is a life-saving practice.</p>',
        images: JSON.stringify(['/uploads/breast_cancer_symptoms_guide.png']),
        videos: JSON.stringify([]),
      },
    });

    // 3. Charitable Medical Convoys
    await prisma.researchArticle.upsert({
      where: { id: 'fb-article-03' },
      update: {},
      create: {
        id: 'fb-article-03',
        title: 'Healing the Community: SATT’s Charitable Medical Convoys',
        titleEn: 'Healing the Community: SATT’s Charitable Medical Convoys',
        titleAr: 'شفاء المجتمع: قوافل الجمعية الطبية الخيرية',
        abstract: 'Discover how SATT is bringing vital cancer screening, early detection services, and medical education to underprivileged communities across Alexandria through charitable convoys.',
        abstractEn: 'Discover how SATT is bringing vital cancer screening, early detection services, and medical education to underprivileged communities across Alexandria through charitable convoys.',
        abstractAr: 'اكتشف كيف تقدم الجمعية خدمات فحص السرطان الحيوية، وخدمات الكشف المبكر، والتثقيف الطبي للمجتمعات المحرومة في جميع أنحاء الإسكندرية من خلال القوافل الخيرية.',
        author: 'SATT Community Outreach',
        authorEn: 'SATT Community Outreach',
        authorAr: 'التواصل المجتمعي في الجمعية',
        publishDate: '2024-04-29',
        category: 'Charity',
        categoryEn: 'Charity',
        categoryAr: 'عمل خيري',
        content: '<h3>A Commitment to Equitable Care</h3><p>At the Scientific Association for Targeted Therapy (SATT), we believe that access to life-saving cancer screening should not be determined by financial status. Guided by the principle that saving one life is akin to saving humanity, our teams are actively working to bridge the healthcare gap through our Charitable Medical Convoys.</p><h3>Bringing Healthcare to the Frontlines</h3><p>Under the guidance of our dedicated medical leadership, SATT organizes comprehensive medical convoys targeting various districts across Alexandria. These mobile initiatives are designed to reach individuals who might otherwise lack access to specialized oncology care.</p><p>Our convoys provide critical services, including:</p><ul><li>Free clinical examinations and early cancer detection screenings.</li><li>Essential laboratory testing for at-risk individuals.</li><li>Educational seminars on cancer risk factors and prevention strategies.</li><li>Distribution of health literacy booklets to empower communities with knowledge.</li></ul><h3>Continuous Support and Follow-Up</h3><p>Our commitment does not end with screening. For individuals who receive a positive diagnosis, SATT ensures continuous medical follow-up, helping navigate the complex journey of cancer treatment to ensure they receive the necessary care for recovery.</p><p>We are profoundly grateful to the medical professionals and volunteers who make these convoys possible. Together, we are fighting cancer at the community level, ensuring that every patient has a fighting chance.</p>',
        contentEn: '<h3>A Commitment to Equitable Care</h3><p>At the Scientific Association for Targeted Therapy (SATT), we believe that access to life-saving cancer screening should not be determined by financial status. Guided by the principle that saving one life is akin to saving humanity, our teams are actively working to bridge the healthcare gap through our Charitable Medical Convoys.</p><h3>Bringing Healthcare to the Frontlines</h3><p>Under the guidance of our dedicated medical leadership, SATT organizes comprehensive medical convoys targeting various districts across Alexandria. These mobile initiatives are designed to reach individuals who might otherwise lack access to specialized oncology care.</p><p>Our convoys provide critical services, including:</p><ul><li>Free clinical examinations and early cancer detection screenings.</li><li>Essential laboratory testing for at-risk individuals.</li><li>Educational seminars on cancer risk factors and prevention strategies.</li><li>Distribution of health literacy booklets to empower communities with knowledge.</li></ul><h3>Continuous Support and Follow-Up</h3><p>Our commitment does not end with screening. For individuals who receive a positive diagnosis, SATT ensures continuous medical follow-up, helping navigate the complex journey of cancer treatment to ensure they receive the necessary care for recovery.</p><p>We are profoundly grateful to the medical professionals and volunteers who make these convoys possible. Together, we are fighting cancer at the community level, ensuring that every patient has a fighting chance.</p>',
        images: JSON.stringify(['/uploads/satt_charitable_convoys.png']),
        videos: JSON.stringify([]),
      },
    });

    // 4. Colon Cancer Abis 2 Campaign
    await prisma.researchArticle.upsert({
      where: { id: 'fb-article-04' },
      update: {},
      create: {
        id: 'fb-article-04',
        title: 'Collaborative Action: Colon Cancer Screening Initiative at Abis 2',
        titleEn: 'Collaborative Action: Colon Cancer Screening Initiative at Abis 2',
        titleAr: 'العمل التعاوني: مبادرة فحص سرطان القولون في أبيس 2',
        abstract: 'SATT partners with leading diagnostic laboratories to launch a targeted colon cancer early detection campaign at the Abis 2 Health Center in Alexandria.',
        abstractEn: 'SATT partners with leading diagnostic laboratories to launch a targeted colon cancer early detection campaign at the Abis 2 Health Center in Alexandria.',
        abstractAr: 'تشارك الجمعية مع المختبرات التشخيصية الرائدة لإطلاق حملة مستهدفة للكشف المبكر عن سرطان القولون في مركز صحة الأسرة بأبيس 2 في الإسكندرية.',
        author: 'SATT Administration',
        authorEn: 'SATT Administration',
        authorAr: 'إدارة الجمعية',
        publishDate: '2024-04-29',
        category: 'Campaign',
        categoryEn: 'Campaign',
        categoryAr: 'حملة',
        content: '<h3>Our Goal: Saving Lives Through Action</h3><p>Early detection remains the most powerful weapon against colorectal cancer. Moving beyond awareness, SATT is taking concrete action to facilitate life-saving screenings directly within local communities. Recently, we successfully launched a targeted early detection campaign at the Abis 2 Family Health Center in Alexandria.</p><h3>Strengthening Diagnostics Through Partnership</h3><p>Effective cancer screening requires precision and reliable diagnostics. To ensure the highest quality of care for our community, this initiative was executed in proud collaboration with Alfa Laboratories and Mabaret Al Asafra Labs.</p><p>These strategic partnerships allowed us to provide comprehensive medical examinations and critical laboratory analyses on-site. By removing logistical barriers, we empower individuals to take immediate control of their digestive health.</p><h3>Building a Preventative Healthcare Culture</h3><p>The Abis 2 initiative is a testament to what can be achieved when medical associations, healthcare centers, and diagnostic laboratories unite with a single purpose. Through these ongoing grassroots campaigns, SATT is dedicated to transforming the narrative around colon cancer from one of fear to one of proactive prevention.</p>',
        contentEn: '<h3>Our Goal: Saving Lives Through Action</h3><p>Early detection remains the most powerful weapon against colorectal cancer. Moving beyond awareness, SATT is taking concrete action to facilitate life-saving screenings directly within local communities. Recently, we successfully launched a targeted early detection campaign at the Abis 2 Family Health Center in Alexandria.</p><h3>Strengthening Diagnostics Through Partnership</h3><p>Effective cancer screening requires precision and reliable diagnostics. To ensure the highest quality of care for our community, this initiative was executed in proud collaboration with Alfa Laboratories and Mabaret Al Asafra Labs.</p><p>These strategic partnerships allowed us to provide comprehensive medical examinations and critical laboratory analyses on-site. By removing logistical barriers, we empower individuals to take immediate control of their digestive health.</p><h3>Building a Preventative Healthcare Culture</h3><p>The Abis 2 initiative is a testament to what can be achieved when medical associations, healthcare centers, and diagnostic laboratories unite with a single purpose. Through these ongoing grassroots campaigns, SATT is dedicated to transforming the narrative around colon cancer from one of fear to one of proactive prevention.</p>',
        images: JSON.stringify(['/uploads/abis2_colon_campaign.png']),
        videos: JSON.stringify([]),
      },
    });

    // 5. Colorectal Cancer Awareness Campaign (Phase 1)
    await prisma.researchArticle.upsert({
      where: { id: 'fb-article-01' },
      update: {},
      create: {
        id: 'fb-article-01',
        title: 'The Power of Early Detection: Colorectal Cancer Awareness Campaign',
        titleEn: 'The Power of Early Detection: Colorectal Cancer Awareness Campaign',
        titleAr: 'قوة الكشف المبكر: حملة التوعية بسرطان القولون والمستقيم',
        abstract: 'Learn about the vital Colorectal Cancer Awareness Campaign at Alexandria University, focusing on early detection, prevention, and proactive patient education.',
        abstractEn: 'Learn about the vital Colorectal Cancer Awareness Campaign at Alexandria University, focusing on early detection, prevention, and proactive patient education.',
        abstractAr: 'تعرف على حملة التوعية الحيوية بسرطان القولون والمستقيم في جامعة الإسكندرية، والتي تركز على الكشف المبكر والوقاية وتثقيف المرضى الاستباقي.',
        author: 'SATT Admin',
        authorEn: 'SATT Admin',
        authorAr: 'مشرف الجمعية',
        publishDate: '2024-04-29',
        category: 'Awareness',
        categoryEn: 'Awareness',
        categoryAr: 'توعية',
        content: '<h3>Empowering Through Education</h3><p>Knowledge is one of the most powerful tools in the fight against cancer. In a dedicated effort to educate the community and save lives, the Alexandria University Faculty of Medicine recently hosted a comprehensive Colorectal Cancer Awareness Campaign. This initiative stands as a critical reminder of why proactive healthcare and medical education matter.</p><h3>Why Early Detection Matters</h3><p>Colorectal cancer is a highly treatable disease—when caught early. Unfortunately, many cases are diagnosed in later stages due to a lack of awareness regarding routine screening and early warning signs. The campaign focused heavily on breaking the silence surrounding digestive health, urging both men and women to prioritize regular medical check-ups.</p><p>Screening methods, such as colonoscopies, are not just diagnostic tools; they are preventative measures that can identify and remove precancerous polyps before they ever develop into cancer.</p><h3>Community Support and Medical Guidance</h3><p>The awareness campaign brought together oncology specialists, medical students, and the public for open, supportive dialogue. By addressing common fears and misconceptions about screening procedures, the initiative successfully fostered a culture of preventative health.</p><p>Participants were provided with actionable advice on lifestyle modifications, dietary changes, and the specific screening guidelines based on age and family history.</p><h3>Take Action Today</h3><p>Cancer prevention begins with a single step: scheduling a consultation. We strongly encourage everyone, especially those over the age of 45 or with a family history of the disease, to speak with their healthcare provider about colorectal cancer screening. Early detection doesn\'t just improve outcomes; it saves lives.</p>',
        contentEn: '<h3>Empowering Through Education</h3><p>Knowledge is one of the most powerful tools in the fight against cancer. In a dedicated effort to educate the community and save lives, the Alexandria University Faculty of Medicine recently hosted a comprehensive Colorectal Cancer Awareness Campaign. This initiative stands as a critical reminder of why proactive healthcare and medical education matter.</p><h3>Why Early Detection Matters</h3><p>Colorectal cancer is a highly treatable disease—when caught early. Unfortunately, many cases are diagnosed in later stages due to a lack of awareness regarding routine screening and early warning signs. The campaign focused heavily on breaking the silence surrounding digestive health, urging both men and women to prioritize regular medical check-ups.</p><p>Screening methods, such as colonoscopies, are not just diagnostic tools; they are preventative measures that can identify and remove precancerous polyps before they ever develop into cancer.</p><h3>Community Support and Medical Guidance</h3><p>The awareness campaign brought together oncology specialists, medical students, and the public for open, supportive dialogue. By addressing common fears and misconceptions about screening procedures, the initiative successfully fostered a culture of preventative health.</p><p>Participants were provided with actionable advice on lifestyle modifications, dietary changes, and the specific screening guidelines based on age and family history.</p><h3>Take Action Today</h3><p>Cancer prevention begins with a single step: scheduling a consultation. We strongly encourage everyone, especially those over the age of 45 or with a family history of the disease, to speak with their healthcare provider about colorectal cancer screening. Early detection doesn\'t just improve outcomes; it saves lives.</p>',
        images: JSON.stringify(['/uploads/colorectal-awareness.png']),
        videos: JSON.stringify([]),
      },
    });

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
