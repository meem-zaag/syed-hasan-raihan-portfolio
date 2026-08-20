-- NOTE: The CV this seed data is sourced from only lists a subset of the user's real project history.
-- Additional past projects (not present in the CV) must be added manually via the admin Projects
-- manager after first login. This migration intentionally does not fabricate projects beyond the CV.

-- Seeded admin login: username "admin", password "ChangeMe123!" — CHANGE THIS IMMEDIATELY after first
-- login. Hash below is a bcrypt hash of that password.
INSERT INTO admin_user (username, password_hash, role)
VALUES ('admin', '$2b$10$kGUQr0DVoZ4gyih/l5Rcb.slRilR6.ReIKE2dDSI2BhHnntTMqU/C', 'ADMIN');

INSERT INTO profile (id, full_name, title, tagline, bio, email, phone, location, github_url, linkedin_url)
VALUES (
    1,
    'Syed Hasan Raihan',
    'Software Engineer | React & Next.js Specialist | UI/UX Engineering & Performance Optimization',
    'Building high-performance, motion-rich web products with React and Next.js',
    'Software Engineer with 4+ years of experience building high-performance web products using React.js and Next.js. Currently working at RedDot Digital as a staff-augmented engineer from ZAAG SYSTEMS. Strong background in UI engineering, motion-rich frontend development, technical SEO, scalable state management, and cross-platform performance optimization. Experienced in delivering portfolio, SaaS, e-commerce, and AI-driven products while working directly with clients, translating business needs into polished, production-ready interfaces.',
    'syed.hasan.meem@gmail.com',
    '+8801686678009',
    'Dhaka, Bangladesh',
    'https://github.com/meem-zaag',
    'https://linkedin.com/in/syed-hasan-raihan'
);

INSERT INTO site_settings (id, seo_default_title, seo_default_description, theme_accent_color)
VALUES (
    1,
    'Syed Hasan Raihan — Software Engineer',
    'Portfolio of Syed Hasan Raihan, a software engineer specializing in React, Next.js, and performance-driven UI engineering.',
    '#6366f1'
);

-- Pages
INSERT INTO page (slug, title, meta_title, meta_description) VALUES
    ('home', 'Home', 'Syed Hasan Raihan — Software Engineer', 'Software engineer specializing in React, Next.js and performance-driven UI engineering.'),
    ('about', 'About', 'About — Syed Hasan Raihan', 'Learn more about Syed Hasan Raihan''s background and experience.'),
    ('projects', 'Projects', 'Projects — Syed Hasan Raihan', 'Selected projects built by Syed Hasan Raihan.'),
    ('experience', 'Experience', 'Experience — Syed Hasan Raihan', 'Professional work experience of Syed Hasan Raihan.'),
    ('education', 'Education', 'Education — Syed Hasan Raihan', 'Educational background of Syed Hasan Raihan.'),
    ('skills', 'Skills', 'Skills — Syed Hasan Raihan', 'Technical skills of Syed Hasan Raihan.'),
    ('contact', 'Contact', 'Contact — Syed Hasan Raihan', 'Get in touch with Syed Hasan Raihan.');

-- Starter sections (admin-editable)
INSERT INTO section (page_id, section_key, heading, subheading, description, section_type, order_index, visible)
SELECT id, 'hero', 'Syed Hasan Raihan',
       'Software Engineer | React & Next.js Specialist | UI/UX Engineering & Performance Optimization',
       'Software Engineer with 4+ years of experience building high-performance web products using React.js and Next.js. Strong background in UI engineering, motion-rich frontend development, technical SEO, scalable state management, and cross-platform performance optimization.',
       'HERO', 0, true
FROM page WHERE slug = 'home';

INSERT INTO section (page_id, section_key, heading, subheading, description, section_type, order_index, visible)
SELECT id, 'intro', 'About Me', NULL,
       'Software Engineer with 4+ years of experience building high-performance web products using React.js and Next.js. Currently working at RedDot Digital as a staff-augmented engineer from ZAAG SYSTEMS. Strong background in UI engineering, motion-rich frontend development, technical SEO, scalable state management, and cross-platform performance optimization. Experienced in delivering portfolio, SaaS, e-commerce, and AI-driven products while working directly with clients, translating business needs into polished, production-ready interfaces.',
       'GENERIC', 0, true
FROM page WHERE slug = 'about';

INSERT INTO section (page_id, section_key, heading, subheading, description, section_type, order_index, visible)
SELECT id, 'intro', 'Selected Projects', 'A few things I''ve built recently', NULL, 'GENERIC', 0, true
FROM page WHERE slug = 'projects';

INSERT INTO section (page_id, section_key, heading, subheading, description, section_type, order_index, visible)
SELECT id, 'intro', 'Work Experience', NULL, NULL, 'GENERIC', 0, true
FROM page WHERE slug = 'experience';

INSERT INTO section (page_id, section_key, heading, subheading, description, section_type, order_index, visible)
SELECT id, 'intro', 'Education', NULL, NULL, 'GENERIC', 0, true
FROM page WHERE slug = 'education';

INSERT INTO section (page_id, section_key, heading, subheading, description, section_type, order_index, visible)
SELECT id, 'intro', 'Skills', NULL, NULL, 'GENERIC', 0, true
FROM page WHERE slug = 'skills';

INSERT INTO section (page_id, section_key, heading, subheading, description, section_type, order_index, visible)
SELECT id, 'intro', 'Get In Touch', 'Have a project in mind? Let''s talk.', NULL, 'GENERIC', 0, true
FROM page WHERE slug = 'contact';

-- Skill categories + skills
INSERT INTO skill_category (name, order_index) VALUES
    ('Frontend', 0),
    ('Backend (learning)', 1),
    ('UI & Motion', 2),
    ('Performance', 3);

INSERT INTO skill (skill_category_id, name, proficiency, order_index)
SELECT id, s.name, s.proficiency, s.order_index
FROM skill_category, (VALUES
    ('React.js', 90, 0), ('Next.js', 90, 1), ('Angular', 65, 2), ('JavaScript', 90, 3),
    ('TypeScript', 85, 4), ('HTML', 90, 5), ('CSS', 85, 6), ('Tailwind CSS', 90, 7),
    ('Responsive UI Development', 85, 8)
) AS s(name, proficiency, order_index)
WHERE skill_category.name = 'Frontend';

INSERT INTO skill (skill_category_id, name, proficiency, order_index)
SELECT id, s.name, s.proficiency, s.order_index
FROM skill_category, (VALUES
    ('Java', 55, 0), ('Spring Boot', 55, 1), ('REST API Integration', 70, 2)
) AS s(name, proficiency, order_index)
WHERE skill_category.name = 'Backend (learning)';

INSERT INTO skill (skill_category_id, name, proficiency, order_index)
SELECT id, s.name, s.proficiency, s.order_index
FROM skill_category, (VALUES
    ('GSAP', 80, 0), ('Framer Motion', 85, 1), ('UI/UX Engineering', 80, 2),
    ('Design Systems', 75, 3), ('Aceternity UI', 80, 4), ('Ant Design', 80, 5)
) AS s(name, proficiency, order_index)
WHERE skill_category.name = 'UI & Motion';

INSERT INTO skill (skill_category_id, name, proficiency, order_index)
SELECT id, s.name, s.proficiency, s.order_index
FROM skill_category, (VALUES
    ('Performance Optimization', 85, 0), ('Technical SEO', 80, 1),
    ('Cross-platform Debugging', 80, 2), ('Lighthouse Optimization', 85, 3),
    ('Reusable Components', 85, 4)
) AS s(name, proficiency, order_index)
WHERE skill_category.name = 'Performance';

-- Experience (most recent first)
INSERT INTO experience (company, role, location, start_date, end_date, description, order_index) VALUES
(
    'RedDot Digital Limited', 'Software Engineer', 'Dhaka', '2026-07-01', NULL,
    'Staff augmentation placement via ZAAG SYSTEMS.
Currently developing the Bijoy web application for British American Tobacco (BAT) - an enterprise client engagement in progress - building the frontend with Angular and extending existing React.js and Next.js experience to a component-based Angular architecture.
Collaborate directly with in-house product, design, and backend stakeholders to translate requirements into scalable, maintainable UI.
Expanding into backend development through an ongoing Spring Boot learning phase, working towards end-to-end feature delivery across Java-based services and the frontend layer.',
    0
),
(
    'ZAAG SYSTEMS', 'Software Engineer', 'Dhaka', '2025-10-01', '2026-06-30',
    'Orchestrated end-to-end development of the Apex portfolio, including direct client consultation and custom video-rendering solutions to address macOS and iOS performance bottlenecks.
Improved Safari video loading time by 70% while reducing overall page loading and buffering time for motion-heavy web experiences across Apple devices.
Achieved 90+ Lighthouse performance scores by optimizing rendering strategy, media delivery, and frontend asset loading across production projects.
Lead frontend architecture and platform management for web products across the Zaag ecosystem using Next.js, Tailwind CSS, and modern component systems.
Manage end-to-end project execution by aligning client requirements with technical delivery, scalable UI patterns, and maintainable frontend standards.',
    1
),
(
    'ZAAG SYSTEMS', 'Junior Software Engineer', 'Dhaka', '2022-09-01', '2025-10-31',
    'Built bespoke UI animations with GSAP and Framer Motion to translate design concepts into polished, interactive user experiences.
Improved technical SEO and frontend performance for company websites through Next.js SSR, optimized API integration, and cleaner component architecture.
Contributed to Zaag AI product interfaces by integrating Tailwind CSS, Aceternity UI, and Ant Design into responsive, production-ready screens.
Developed reusable React and Next.js components that improved consistency, maintainability, and delivery speed across multiple client projects.',
    2
),
(
    'ZAAG SYSTEMS', 'Frontend Web Developer', 'Uttara Sector 1', '2022-05-01', '2022-09-30',
    'Resolved production-level bugs and technical debt using JavaScript and React.js to maintain stable, high-performance interfaces.
Developed reusable UI components with Next.js and React, improving consistency and development efficiency across projects.
Applied JavaScript DOM manipulation and troubleshooting techniques to fix interactive UI issues and improve overall user experience.',
    3
);

-- Education (most recent first)
INSERT INTO education (institution, degree, field, start_date, end_date, date_precision, order_index) VALUES
('North South University', 'Bachelor of Science (BS)', 'Computer Science', '2016-01-01', '2021-12-31', 'YEAR', 0),
('Dhaka City College', 'Higher Secondary Certificate (HSC)', NULL, '2014-01-01', '2015-12-31', 'YEAR', 1),
('Udayan Uchcha Madhyamik Bidyalaya', 'Secondary School Certificate (SSC)', NULL, '2013-01-01', '2013-12-31', 'YEAR', 2);

-- Selected projects from the CV
INSERT INTO project (title, slug, summary, description, client_name, category, status, featured, order_index, start_date, end_date) VALUES
(
    'Bijoy Web Application', 'bijoy-web-application',
    'Angular-based enterprise web application built at RedDot Digital for British American Tobacco (BAT), currently in progress.',
    'Angular-based enterprise web application built at RedDot Digital for British American Tobacco (BAT), currently under active development. Responsible for frontend implementation, reusable component structure, and UI consistency across the product.',
    'British American Tobacco (BAT)', 'Enterprise Web App', 'IN_PROGRESS', false, 0, '2026-07-01', NULL
),
(
    'Zaagshop', 'zaagshop',
    'E-commerce platform for entrepreneurs in Bangladesh to create, customize, and manage online stores without coding skills.',
    'A powerful e-commerce platform designed for entrepreneurs in Bangladesh to create, customize, and manage online stores without coding skills. Contributed to scalable frontend architecture, state management, and business logic for a reliable shopping experience.',
    'ZAAG SYSTEMS', 'E-commerce', 'COMPLETED', true, 1, NULL, NULL
),
(
    'Apex Footwear Ltd', 'apex-footwear-ltd',
    'Corporate website for Apex Bangladesh - 70% faster Safari video loading and 90+ Lighthouse performance scores.',
    'Corporate website project associated with ZAAG SYSTEMS for Apex Bangladesh. Improved Safari video loading time by 70%, reduced buffering and page load delays, and helped drive Lighthouse performance scores above 90 for the final experience.',
    'Apex Bangladesh', 'Corporate Website', 'COMPLETED', true, 2, '2025-03-01', '2026-06-30'
),
(
    'Zaag AI Chatbot', 'zaag-ai-chatbot',
    'Secure, multilingual AI knowledge-base chatbot delivering a complete AI workforce solution.',
    'AI solution focused on creating a secure knowledge base that answers accurately in any language customers speak. Worked on the web experience and product interface for a complete AI workforce solution.',
    'ZAAG SYSTEMS', 'AI Product', 'COMPLETED', false, 3, NULL, NULL
);

INSERT INTO project_tech_tag (project_id, tag, tag_order)
SELECT id, t.tag, t.tag_order FROM project,
    (VALUES ('Angular', 0), ('TypeScript', 1), ('Enterprise Frontend', 2)) AS t(tag, tag_order)
WHERE project.slug = 'bijoy-web-application';

INSERT INTO project_tech_tag (project_id, tag, tag_order)
SELECT id, t.tag, t.tag_order FROM project,
    (VALUES ('React.js', 0), ('Next.js', 1), ('E-commerce', 2), ('State Management', 3)) AS t(tag, tag_order)
WHERE project.slug = 'zaagshop';

INSERT INTO project_tech_tag (project_id, tag, tag_order)
SELECT id, t.tag, t.tag_order FROM project,
    (VALUES ('Next.js', 0), ('Tailwind CSS', 1), ('GSAP', 2), ('Performance Optimization', 3)) AS t(tag, tag_order)
WHERE project.slug = 'apex-footwear-ltd';

INSERT INTO project_tech_tag (project_id, tag, tag_order)
SELECT id, t.tag, t.tag_order FROM project,
    (VALUES ('React.js', 0), ('Next.js', 1), ('AI', 2), ('Multilingual', 3)) AS t(tag, tag_order)
WHERE project.slug = 'zaag-ai-chatbot';
