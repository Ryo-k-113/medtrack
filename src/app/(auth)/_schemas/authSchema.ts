import { z } from "zod"; 

export const authSchema = z.object({
  email: z 
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }), 
  password: z 
    .string() 
    .min(8, { message: "パスワードは8文字以上で入力してください" }) 
    .refine((v) => /[a-zA-Z]/.test(v), { 
      message: "アルファベットを含めてください", 
    }) 
    .refine((v) => /[0-9]/.test(v), { 
      message: "数字を含めてください", 
    }) 
    .refine((v) => /[@$!%*#?&]/.test(v), { 
      message: "記号（@$!%*#?&）を含めてください", 
    }), 
}); 

export type FormData = z.infer<typeof authSchema>;