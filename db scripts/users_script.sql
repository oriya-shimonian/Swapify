-- יצירת טבלת Users עם SERIAL ל- user_id
CREATE TABLE IF NOT EXISTS public."Users"
(
    user_id SERIAL PRIMARY KEY,  -- משתמש ב-SERIAL שמייצר את הסיקוונס אוטומטית
    name text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    password_hash text COLLATE pg_catalog."default" NOT NULL,
    profile_picture text COLLATE pg_catalog."default" NOT NULL,
    location text COLLATE pg_catalog."default" NOT NULL,
    auth_provider text COLLATE pg_catalog."default" NOT NULL,
    role_id integer NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES public."Role" (role_id) ON DELETE CASCADE
)
TABLESPACE pg_default;

-- שינוי הבעלות על הטבלה
ALTER TABLE IF EXISTS public."Users"
    OWNER to postgres;
