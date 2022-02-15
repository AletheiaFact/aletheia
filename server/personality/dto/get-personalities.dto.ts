import { IsAlpha, IsBoolean, IsInt, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsPositive, IsString, Max, ValidateNested } from 'class-validator';

export class GetPersonalities {
    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    @IsPositive()
    @Max(10) // número hipotetico
    page: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    pageSize: number;

    @IsNotEmpty()
    @IsString()
    order: string; //asc desc

    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    language: string;

    @IsNotEmpty()
    @IsBoolean()
    withSuggestions: boolean;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    query: object;
}

//     @IsNotEmptyObject()
//     @IsObject()
//     @ValidateNested()
//     query: {
//         language: string;
//         withSuggestions: boolean;
//     };
// }