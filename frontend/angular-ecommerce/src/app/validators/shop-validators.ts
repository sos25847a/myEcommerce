import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidators {

    // 對空格做驗證
    static notWhitespace(control:FormControl):ValidationErrors | null{

        // 確認是否有空格
        // 使用 trim() 去除首尾的空白，再檢查長度是否為 0
        if( (control.value!=null) && (control.value.trim().length===0)){
            return {'notWhitespace':true};
        }        
        // 檢查是否包含空格
        if (control.value?.includes(' ')) {
            return { 'notWhitespace': true };
        }
        return null;

    }
}
