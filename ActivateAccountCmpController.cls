public class ActivateAccountCmpController {
    @AuraEnabled(cacheable = true)
    public static List<Account> getAccounts(){
        return [Select Id, Name, AnnualRevenue, Active__c, Website, Type, Industry, AccountSource FROM Account];
    }
    
    @AuraEnabled        
    public static List<String> getPickListValues(String objectType, String selectedField){
        List<String> pickListValuesList = new List<String>();
        Schema.DescribeFieldResult fieldResult =  Schema.getGlobalDescribe().get(objectType).getDescribe().fields.getMap().get(selectedField).getDescribe();
        List<Schema.PicklistEntry> pickListEnterValuesList = fieldResult.getPicklistValues();
        pickListValuesList.add('--None--');
        for( Schema.PicklistEntry pickListVal : pickListEnterValuesList){
            pickListValuesList.add(pickListVal.getLabel());
        }     
        return pickListValuesList;       
    }
    
    @AuraEnabled
    public static void activateSelectedRecords(List<Account> records){
        try{
            update records;
        }catch(Exception ex){
            throw new AuraHandledException(ex.getMessage());
        }
    }
    
}
