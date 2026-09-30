"use client";

import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import type { OptionSearch } from "@/hooks/useOptionSearch";
import type { SelectOption } from "@/types/ui/select";

type FormAsyncComboboxProps = {
  name: string;
  label: string;
  search: OptionSearch;  //候補の検索結果と検索操作
  registeredOption?: SelectOption | null;  //登録済みの値（編集時。検索結果に無くても表示する）
  placeholder?: string;
  required?: boolean;
  className?: string;
};

/**
 * 入力した文字でAPIを検索して候補を出すRHFコンボボックス
 * 件数の多いマスタを、全件読み込まず選択する
 */
export const FormAsyncCombobox = ({
  name,
  label,
  search,
  registeredOption = null,
  placeholder = "入力して検索",
  required = false,
  className,
}: FormAsyncComboboxProps) => {
  const { control } = useFormContext();
  const { field, fieldState } = useController({ control, name });

  const { options: searchedOptions, totalCount, isSearching, error, changeSearch } = search;

  // この画面で選び直した値（選び直すまでは registeredOption を使う）
  const [pickedOption, setPickedOption] = useState<SelectOption | null>(null);

  // フォームの値に対応する選択肢
  const selectedOption =
    [pickedOption, registeredOption].find((option) => option?.value === field.value) ?? null;

  // 入力に合わせて検索する（選択中の名前が表示中は、絞り込まずに候補を出す）
  const handleInputValueChange = (inputValue: string) => {
    changeSearch(inputValue === selectedOption?.label ? "" : inputValue.trim());
  };

  // 選択中の値が検索結果に無くても、表示と再選択ができるよう先頭に加える
  const items =
    selectedOption && !searchedOptions.some((option) => option.value === selectedOption.value)
      ? [selectedOption, ...searchedOptions]
      : searchedOptions;

  // 検索結果が上限を超えたときは、絞り込みを促す
  const hiddenCount = totalCount - searchedOptions.length;

  return (
    <Field
      data-invalid={fieldState.invalid}
      className={cn("flex flex-col gap-1", className)}
    >
      <FieldLabel htmlFor={name}>
        {label}
        {required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <Combobox
        items={items}
        // 絞り込みはAPIの検索で行う
        filter={null}
        value={selectedOption}
        onValueChange={(option) => {
          setPickedOption(option);
          field.onChange(option?.value ?? "");
        }}
        onInputValueChange={handleInputValueChange}
        isItemEqualToValue={(item, value) => item.value === value.value}
      >
        <ComboboxInput
          id={name}
          placeholder={placeholder}
          showClear={false}
          showTrigger={true}
          onBlur={field.onBlur}
          className={cn(
            "w-full bg-background text-foreground",
            fieldState.invalid && "border-destructive text-destructive"
          )}
        />

        {/* 入力欄の下に開く */}
        <ComboboxContent
          collisionAvoidance={{ side: "none" }}
          className="flex w-full flex-col max-h-[var(--available-height)]"
          style={{ width: "var(--positioner-anchor-width, 100%)" }}
        >
        
          <ComboboxEmpty className="group-data-[empty]/combobox-content:flex text-weak">
            {isSearching
              ? "検索中…" : "該当する項目が見つかりません"}
          </ComboboxEmpty>
         
          <ComboboxList className="max-h-72 min-h-0 overflow-y-auto data-[empty]:p-0">
            {(item: SelectOption) => (
              <ComboboxItem
                key={item.value}
                value={item}
                className="hover:bg-surface hover:text-foreground cursor-pointer"
              >
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
          {hiddenCount > 0 && (
            <p className="border-t px-3 py-2 text-xs text-weak">
              ほかに{hiddenCount}件あります。入力して絞り込んでください
            </p>
          )}
        </ComboboxContent>
      </Combobox>
      {/* エラー表示 */}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
};
