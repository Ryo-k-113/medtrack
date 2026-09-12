-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "product_type" AS ENUM ('BRAND_NAME', 'QUASI_BRAND_NAME', 'GENERIC', 'OTHER');

-- CreateEnum
CREATE TYPE "publish_status" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "current_shipping_status" AS ENUM ('NORMAL_SHIPMENT', 'LIMITED_SHIPMENT', 'SHIPMENT_SUSPENDED', 'DISCONTINUED_SALE');

-- CreateEnum
CREATE TYPE "announce_publish_status" AS ENUM ('DRAFT', 'PUBLISHED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "announce_type" AS ENUM ('NORMAL_SHIPMENT', 'LIMITED_SHIPMENT', 'SHIPMENT_SUSPENDED', 'DISCONTINUED_SALE', 'TRANSFER_OF_SALE');

-- CreateEnum
CREATE TYPE "process_status" AS ENUM ('PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "batch_job_type" AS ENUM ('UPDATE_SHIPPING_STATUS');

-- CreateEnum
CREATE TYPE "batch_job_status" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "supabase_user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmark_drugs" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "drug_id" INTEGER NOT NULL,

    CONSTRAINT "bookmark_drugs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drugs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30),
    "drug_price_listing_code" TEXT,
    "yj_code" TEXT NOT NULL,
    "is_select_medical" BOOLEAN,
    "is_authorized_generic" BOOLEAN,
    "package_insert_url" TEXT,
    "product_type" "product_type" NOT NULL,
    "transitional_measures_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "unit_id" INTEGER NOT NULL,
    "generic_name_id" INTEGER NOT NULL,
    "manufacturing_company_id" INTEGER NOT NULL,
    "sales_company_id" INTEGER NOT NULL,

    CONSTRAINT "drugs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "package_units" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "gs1_sales_code" TEXT NOT NULL,
    "gs1_dispensing_code" TEXT,
    "hot_code" TEXT,
    "unified_code" TEXT,
    "current_shipping_status" "current_shipping_status" NOT NULL,
    "sales_transfer_date" TIMESTAMP(3),
    "discontinued_date" TIMESTAMP(3),
    "publish_status" "publish_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "drug_id" INTEGER NOT NULL,

    CONSTRAINT "package_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_announcements" (
    "id" SERIAL NOT NULL,
    "announced_date" TIMESTAMP(3) NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL,
    "announce_type" "announce_type" NOT NULL,
    "publish_status" "announce_publish_status" NOT NULL DEFAULT 'PUBLISHED',
    "process_status" "process_status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "package_unit_id" INTEGER NOT NULL,

    CONSTRAINT "shipping_announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generic_names" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generic_names_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pharmaceutical_companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pharmaceutical_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batch_processing_logs" (
    "id" SERIAL NOT NULL,
    "job_type" "batch_job_type" NOT NULL,
    "status" "batch_job_status" NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "error_code" TEXT,
    "error_message" TEXT,
    "processed_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "batch_processing_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_supabase_user_id_key" ON "users"("supabase_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "bookmark_drugs_user_id_drug_id_key" ON "bookmark_drugs"("user_id", "drug_id");

-- CreateIndex
CREATE UNIQUE INDEX "drugs_yj_code_sales_company_id_key" ON "drugs"("yj_code", "sales_company_id");

-- CreateIndex
CREATE UNIQUE INDEX "package_units_gs1_sales_code_key" ON "package_units"("gs1_sales_code");

-- CreateIndex
CREATE UNIQUE INDEX "package_units_hot_code_key" ON "package_units"("hot_code");

-- CreateIndex
CREATE UNIQUE INDEX "package_units_unified_code_key" ON "package_units"("unified_code");

-- CreateIndex
CREATE INDEX "shipping_announcements_effective_date_process_status_publis_idx" ON "shipping_announcements"("effective_date", "process_status", "publish_status");

-- CreateIndex
CREATE UNIQUE INDEX "units_name_key" ON "units"("name");

-- CreateIndex
CREATE UNIQUE INDEX "generic_names_name_key" ON "generic_names"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pharmaceutical_companies_name_key" ON "pharmaceutical_companies"("name");

-- AddForeignKey
ALTER TABLE "bookmark_drugs" ADD CONSTRAINT "bookmark_drugs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark_drugs" ADD CONSTRAINT "bookmark_drugs_drug_id_fkey" FOREIGN KEY ("drug_id") REFERENCES "drugs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drugs" ADD CONSTRAINT "drugs_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drugs" ADD CONSTRAINT "drugs_generic_name_id_fkey" FOREIGN KEY ("generic_name_id") REFERENCES "generic_names"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drugs" ADD CONSTRAINT "drugs_manufacturing_company_id_fkey" FOREIGN KEY ("manufacturing_company_id") REFERENCES "pharmaceutical_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drugs" ADD CONSTRAINT "drugs_sales_company_id_fkey" FOREIGN KEY ("sales_company_id") REFERENCES "pharmaceutical_companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_units" ADD CONSTRAINT "package_units_drug_id_fkey" FOREIGN KEY ("drug_id") REFERENCES "drugs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_announcements" ADD CONSTRAINT "shipping_announcements_package_unit_id_fkey" FOREIGN KEY ("package_unit_id") REFERENCES "package_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

