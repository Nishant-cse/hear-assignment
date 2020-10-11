({
    init : function(cmp, event, helper) {
        //set columns
        cmp.set('v.mycolumns', [
            { label: 'Account Name', fieldName: 'redirectLink', type: 'url',typeAttributes: { label: { fieldName: 'Name' },target: '_blank'}},
            { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'currency', cellAttributes: { alignment: 'left' }},
            { label: 'Active', fieldName: 'Active__c', type: 'text'},
            { label: 'Website', fieldName: 'Website', type: 'url',typeAttributes: { label: { fieldName: 'website'},target: '_blank'}}
        ]);
        //call helper method to fetch account data
        helper.getAccountData(cmp);
    },
    
    onChangefilter1 : function(cmp, event, helper){
        console.log('f1==>', cmp.get('v.filter1Value'));
        if(cmp.get('v.filter1Value') == 'Customer - Channel'){
            cmp.set('v.showIndustryFilter', true);
            cmp.set('v.showSecondFilter', true);
            helper.setfilterData(cmp, event);
            
        }else if(cmp.get('v.filter1Value') != '--None--' && cmp.get('v.filter1Value') != 'Customer - Channel'){
            cmp.set('v.showIndustryFilter', false);
            cmp.set('v.showSecondFilter', true);
            helper.setfilterData(cmp, event);
            
        }else{
            cmp.set('v.showSecondFilter', false);
            cmp.set('v.filter1Value', '--None--');
            cmp.set('v.filter2Value', '--None--');
            cmp.set('v.filter3Value', '--None--');
            cmp.set('v.data', cmp.get('v.tempData'));
        }
        
    },
    getSelectedRecord: function (cmp, event, helper) {
        cmp.set('v.recordsToActivate', []);
        var selectedRows = event.getParam('selectedRows');
        // Display that fieldName of the selected rows
        let accounts2Activate= [];
        console.log('selectedRows---', selectedRows);
        for (var i = 0; i < selectedRows.length; i++){
            selectedRows[i].Active__c= 'Yes';
            accounts2Activate.push(selectedRows[i]);
        }
        cmp.set('v.recordsToActivate', accounts2Activate);
    },
    activateRecords : function(cmp, event, helper){
        let records= cmp.get('v.recordsToActivate');
        if(records.length == 0){
            helper.showToast(cmp, event, 'warning', 'Warning','Please select account reocrds.');
        }else{
            let callActivateFun= true;
            for(let i=0; i< records.length; i++){
                if(records[i].Name == 'Burlington Textiles Corp of America'){
                    callActivateFun= false;
                    break;
                }
            }
            if(callActivateFun){
                helper.activateAccounts(cmp, event, records);
            }else{
                helper.showToast(cmp, event, 'error', 'Error', 'Not allowed to update Burlington Textiles Corp of America account.');
            }
        }
    }
})
