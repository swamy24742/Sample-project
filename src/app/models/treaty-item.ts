export interface ITreatyItem {
    cededNo: string;
    tradingPartner: string;
    riAgency: string;
    treatyName: string;
    agreementType: string,
    calculatedBy: string,
    effectiveDate: Date;
    expirationDate : Date;
    borisId:number;
}

export interface ITreatyConfig {
    isEditMode: boolean;
    hasValues: boolean;
    isDuplicateError: boolean;
}
