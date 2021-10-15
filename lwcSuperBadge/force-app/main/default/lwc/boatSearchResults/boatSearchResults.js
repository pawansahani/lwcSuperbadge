import { api, LightningElement, wire } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats'
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { refreshApex } from '@salesforce/apex'
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList';
import { subscribe,unsubscribe,APPLICATION_SCOPE,MessageContext, publish } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { reduceErrors } from 'c/ldsUtils';
const SUCCESS_VARIANT = 'success';
const SUCCESS_TITLE ='Success';
const MESSAGE_SHIP_IT = 'Ship It!';
const CONST_ERROR = 'Error';
const ERROR_VARIANT = 'error';

export default class BoatSearchResults extends LightningElement {
    boats;
    selectedBoatId;
    error;
    isLoading = false;
    boatTypeId =''
    columns = [
        { label: 'Name', fieldName: 'Name', editable: true, type: 'text' },
        { label: 'Length', fieldName: 'Length__c', editable: true, type: 'number' },
        { label: 'Price', fieldName: 'Price__c', editable: true, type: 'currency', typeAttributes: { currencyCode: 'USD' } },
        { label: 'Description', fieldName: 'Description__c', editable: true, type: 'text' }
      ];
    connectedCallback(){
        this.searchBoats('');
    }
    @wire(MessageContext)
    messageContext;

    @wire(getBoats , {boatTypeId : '$boatTypeId'})
    wiredBoats(result) {
        this.boats = result;
        this.notifyLoading(false);
      }

    @api
    searchBoats(boatTypeId){
      this.boatTypeId = boatTypeId;
      this.notifyLoading(true);
    }

    

    updateSelectedTile(event){
        this.selectedBoatId = event.detail.boatId;
        this.sendMessageService(event.detail.boatId);
    }

    sendMessageService(boatId){
        const payload = {recordId :boatId};
        publish(this.messageContext,BOATMC,payload);
    }

    handleSave(event){
        const recordInputs = event.detail.draftValues
        this.notifyLoading(true);
        updateBoatList({data : recordInputs})
        .then((result)=>{
            this.dispatchEvent(new ShowToastEvent({
                title : SUCCESS_TITLE,
                message : MESSAGE_SHIP_IT,
                variant : SUCCESS_VARIANT
            }));
            
            this.template.querySelector('lightning-datatable').draftValues = [];
            return this.refresh();
        })
        .catch((error) => {
            this.dispatchEvent(new ShowToastEvent({
                title : CONST_ERROR,
                message: error.body.message,
                variant : ERROR_VARIANT
            }));

        })
        .finally(() => {
            
        });

    }

    @api
    async refresh(){
        this.notifyLoading(true);
        await refreshApex(this.boats);
        this.notifyLoading(false);
    }

    notifyLoading(isLoading){
        if(this.isLoading == isLoading) return;
        this.isLoading = isLoading;
        if(isLoading){
            this.dispatchEvent(new CustomEvent('loading'));
        }else{
            this.dispatchEvent(new CustomEvent('doneloading'));
        }
    }
}