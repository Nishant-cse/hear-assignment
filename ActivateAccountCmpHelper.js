({
    getAccountData : function(cmp) {
        var action = cmp.get('c.getAccounts');
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var records =response.getReturnValue();
                //update the redirectLink property of NAME column to make HYPERLINK
                records.forEach(function(record){
                    record.redirectLink = '/'+record.Id;
                });
                cmp.set('v.data', records);
                cmp.set('v.tempData', records);
            } else if (state === "ERROR") {
                var errors = response.getError();
                console.error(errors);
            }
        }));
        $A.enqueueAction(action);
    },
    setfilterData : function(cmp, event){
        console.log('filter1');
        let filter1= cmp.get('v.filter1Value');
        let filter2= cmp.get('v.filter2Value');
        let filter3= cmp.get('v.filter3Value');
        
        let filterData= [];
        if(cmp.get('v.tempData')){
            cmp.get('v.tempData').forEach(function(record){
                if(filter1 != '--None--' && record.Type == filter1){
                    filterData.push(record);
                }
                if(filter2 != '--None--' || filter3 != '--None--'){
                    let data= (filterData.length > 0) ? filterData : cmp.get('v.tempData');
                    if(data.length > 0){
                        for(let i=0; i< filterData.length; i++){
                            if((filter2 != '--None--' && filterData[i].Industry != filter2) || (filter3 != '--None--' && filterData[i].AccountSource != filter3)){
                                filterData.splice(i, 1);
                            }
                        }
                    }
                }
            });
            cmp.set('v.data', filterData);
        }
    },
    showToast : function(component, event, type, title, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "type": type,
            "message": message
        });
        toastEvent.fire();
    },
    activateAccounts : function(cmp, event, recordList){
        var action = cmp.get('c.activateSelectedRecords');
        console.log('---02---');
        action.setParams({
            records : recordList
        });
        action.setCallback(this, $A.getCallback(function (response) {
            var state = response.getState();
            console.log('---2---', state);
            if(state === "SUCCESS"){
                $A.get('e.force:refreshView').fire();
                this.showToast(cmp, event, 'success', 'Success','Records Activated Successfully.');
            } else if(state === "ERROR"){
                var errors = action.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        this.showToast(cmp, event, 'error', 'Error',errors[0].message);
                    }
                }
            }else if (status === "INCOMPLETE") {
                this.showToast(cmp, event, 'error', 'Error', 'No response from server or client is offline.');
            }
            
        }));       
        $A.enqueueAction(action);
    }
})
