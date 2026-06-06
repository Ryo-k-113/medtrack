import { PackageUnitCard } from "./PackageUnitCard"
import type { DrugEditPackageUnitCard  } from "@/types/admin/drug"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

type PackageUnitSectionProps = {
  packageUnits: DrugEditPackageUnitCard[]
  drugId: string
}

export const PackageUnitListSection = ({
  packageUnits,
  drugId,
}: PackageUnitSectionProps) => {
  return (
    <div className="border p-6 rounded-md bg-background shadow-sm">
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <h3 className="text-xl font-bold">包装規格</h3>
      </div>

      {/*  包装カードリンク */}
      {packageUnits.map((pkg) => (
        <PackageUnitCard
          key={pkg.id}
          pkg={pkg}
          drugId={drugId}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-2 py-4"
      >
        <Plus className="h-4 w-4 mr-2" />
        包装を追加する
      </Button>
    </div>
  )
}