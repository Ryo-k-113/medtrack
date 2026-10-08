-- 告知に「在庫消尽後」のフラグを追加する
-- AlterTable
ALTER TABLE "shipping_announcements" ADD COLUMN     "is_after_stock_depletion" BOOLEAN NOT NULL DEFAULT false;
