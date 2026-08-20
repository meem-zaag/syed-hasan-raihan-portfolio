-- Portfolio platform initial schema

CREATE TABLE admin_user (
    id            BIGSERIAL PRIMARY KEY,
    username      VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(30)  NOT NULL DEFAULT 'ADMIN',
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE media (
    id                 BIGSERIAL PRIMARY KEY,
    stored_file_name   VARCHAR(500) NOT NULL,
    original_file_name VARCHAR(500) NOT NULL,
    url                VARCHAR(500) NOT NULL,
    content_type       VARCHAR(150) NOT NULL,
    size_bytes         BIGINT       NOT NULL,
    alt_text           VARCHAR(300),
    linked_entity_type VARCHAR(100),
    linked_entity_id   BIGINT,
    uploaded_at        TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE refresh_token (
    id            BIGSERIAL PRIMARY KEY,
    admin_user_id BIGINT      NOT NULL REFERENCES admin_user(id) ON DELETE CASCADE,
    token_hash    VARCHAR(255) NOT NULL UNIQUE,
    expires_at    TIMESTAMPTZ NOT NULL,
    revoked       BOOLEAN     NOT NULL DEFAULT false,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_refresh_token_admin_user ON refresh_token(admin_user_id);

CREATE TABLE profile (
    id               BIGINT PRIMARY KEY,
    full_name        VARCHAR(150),
    title            VARCHAR(200),
    tagline          VARCHAR(250),
    bio              TEXT,
    email            VARCHAR(200),
    phone            VARCHAR(30),
    location         VARCHAR(150),
    github_url       VARCHAR(300),
    linkedin_url     VARCHAR(300),
    twitter_url      VARCHAR(300),
    website_url      VARCHAR(300),
    avatar_media_id  BIGINT REFERENCES media(id) ON DELETE SET NULL,
    resume_media_id  BIGINT REFERENCES media(id) ON DELETE SET NULL,
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE page (
    id               BIGSERIAL PRIMARY KEY,
    slug             VARCHAR(80) NOT NULL UNIQUE,
    title            VARCHAR(200) NOT NULL,
    meta_title       VARCHAR(200),
    meta_description VARCHAR(500),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE section (
    id            BIGSERIAL PRIMARY KEY,
    page_id       BIGINT NOT NULL REFERENCES page(id) ON DELETE CASCADE,
    section_key   VARCHAR(100) NOT NULL,
    heading       VARCHAR(300),
    subheading    VARCHAR(300),
    description   TEXT,
    section_type  VARCHAR(50) NOT NULL DEFAULT 'GENERIC',
    order_index   INTEGER NOT NULL DEFAULT 0,
    visible       BOOLEAN NOT NULL DEFAULT true,
    content_json  TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_section_page_key UNIQUE (page_id, section_key)
);
CREATE INDEX idx_section_page ON section(page_id);

CREATE TABLE section_image (
    id          BIGSERIAL PRIMARY KEY,
    section_id  BIGINT NOT NULL REFERENCES section(id) ON DELETE CASCADE,
    media_id    BIGINT NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    caption     VARCHAR(300)
);
CREATE INDEX idx_section_image_section ON section_image(section_id);
CREATE INDEX idx_section_image_media ON section_image(media_id);

CREATE TABLE project (
    id           BIGSERIAL PRIMARY KEY,
    title        VARCHAR(200) NOT NULL,
    slug         VARCHAR(220) NOT NULL UNIQUE,
    summary      VARCHAR(500),
    description  TEXT,
    client_name  VARCHAR(200),
    category     VARCHAR(100),
    status       VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    repo_url     VARCHAR(300),
    live_url     VARCHAR(300),
    featured     BOOLEAN NOT NULL DEFAULT false,
    order_index  INTEGER NOT NULL DEFAULT 0,
    start_date   DATE,
    end_date     DATE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE project_tech_tag (
    project_id BIGINT NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    tag        VARCHAR(80) NOT NULL,
    tag_order  INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_project_tech_tag_project ON project_tech_tag(project_id);

CREATE TABLE project_image (
    id          BIGSERIAL PRIMARY KEY,
    project_id  BIGINT NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    media_id    BIGINT NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_cover    BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX idx_project_image_project ON project_image(project_id);
CREATE INDEX idx_project_image_media ON project_image(media_id);

CREATE TABLE skill_category (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE skill (
    id                BIGSERIAL PRIMARY KEY,
    skill_category_id BIGINT NOT NULL REFERENCES skill_category(id) ON DELETE CASCADE,
    name              VARCHAR(150) NOT NULL,
    proficiency       INTEGER NOT NULL DEFAULT 0,
    icon              VARCHAR(150),
    order_index       INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_skill_category ON skill(skill_category_id);

CREATE TABLE experience (
    id                    BIGSERIAL PRIMARY KEY,
    company               VARCHAR(200) NOT NULL,
    role                  VARCHAR(200) NOT NULL,
    location              VARCHAR(150),
    start_date            DATE NOT NULL,
    end_date              DATE,
    description           TEXT,
    company_logo_media_id BIGINT REFERENCES media(id) ON DELETE SET NULL,
    order_index           INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE education (
    id             BIGSERIAL PRIMARY KEY,
    institution    VARCHAR(200) NOT NULL,
    degree         VARCHAR(200) NOT NULL,
    field          VARCHAR(200),
    start_date     DATE,
    end_date       DATE,
    date_precision VARCHAR(20) NOT NULL DEFAULT 'FULL',
    description    TEXT,
    order_index    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE contact_message (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(150) NOT NULL,
    email      VARCHAR(200) NOT NULL,
    subject    VARCHAR(200),
    message    TEXT NOT NULL,
    is_read    BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_contact_message_is_read ON contact_message(is_read);

CREATE TABLE site_settings (
    id                       BIGINT PRIMARY KEY,
    seo_default_title        VARCHAR(200),
    seo_default_description  VARCHAR(500),
    theme_accent_color       VARCHAR(20),
    updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);
