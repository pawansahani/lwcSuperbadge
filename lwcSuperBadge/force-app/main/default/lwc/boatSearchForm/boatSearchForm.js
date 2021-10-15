import { LightningElement, wire } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes'
export default class BoatSearchForm extends LightningElement {
    selectedBoatTypeId = '';
    error = undefined;

    searchOptions;

    @wire(getBoatTypes)
    boatTypes({data,error}){
        if(data){
            this.searchOptions = data.map( type => {
                return {label : type.Name, value : type.Id};
            });
            this.searchOptions.unshift({label : 'ALL Types', value : ''});
        }else if(error){
            this.searchOptions = undefined;
            this.error = error;
        }
    }

    handleSearchOptionChange(event) {
        this.selectedBoatTypeId = event.detail.value;
        const searchEvent = new CustomEvent('search',{detail:{boatTypeId : event.detail.value}});
        this.dispatchEvent(searchEvent);
      }
}