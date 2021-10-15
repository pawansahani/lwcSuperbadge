@RestResource(urlMapping='/v1/getContacts/*')
   global with sharing class getContact {
     @Httpget
      global static list<contact> fetchAccount(){
        RestRequest req = RestContext.request;
        RestResponse res = Restcontext.response;
        Id accId = req.requestURI.substring(req.requestURI.lastIndexOf('/')+1);
        list<contact> lstcontact =[Select id , name,Phone,Fax,Email from contact where Accountid=:accId ];
        
        return lstcontact ;
      }
       
       
      @HttpPost
       global static String insertAccount(){
        //  Map<String, Object> requestBody = (Map<String, Object>) JSON.deserializeUntyped(RestContext.request.requestBody.toString());
         //  System.debug('requestBody' + JSON.serialize(RestContext.request.requestBody));
          List<Account> acc = (List<Account>)JSON.deserialize(RestContext.request.requestBody.toString(), List<Account>.class);
           //insert acc;
           List<Account> AccoutntoInsert= new List<Account>();
           for(Account a : acc){
               Account temp = new Account();
               temp.name = a.name;
               AccoutntoInsert.add(temp);
			}
           if(AccoutntoInsert!=null && AccoutntoInsert.size()>0){
               insert  AccoutntoInsert;
           }
           return RestContext.request.requestBody.toString();
           
       }
   }