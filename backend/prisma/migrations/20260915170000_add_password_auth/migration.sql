-- Passwords are optional because Microsoft-only accounts do not need one.
-- Only salted password hashes are stored; plaintext passwords never enter the database.
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;
