import { LightningElement,wire,track,api } from 'lwc';
import findAccountTeamMember from '@salesforce/apex/AccountTeamHandler.findAccountTeamMember';
import 	Assignment from '@salesforce/resourceUrl/Assignment';
import {NavigationMixin} from 'lightning/navigation';
import findTeamRole from '@salesforce/apex/AccountTeamHandler.findTeamRole';
import findUser from '@salesforce/apex/AccountTeamHandler.findUser';
import accountAccess from '@salesforce/apex/AccountTeamHandler.accountAccess';
import caseAccess from '@salesforce/apex/AccountTeamHandler.caseAccess';
import opportunityAccess from '@salesforce/apex/AccountTeamHandler.opportunityAccess';
import insertAccountTeamMember from '@salesforce/apex/AccountTeamHandler.insertAccountTeamMember';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import TeamMemberRole from '@salesforce/schema/AccountTeamMember.TeamMemberRole';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import AccountTeamMember_OBJECT from '@salesforce/schema/AccountTeamMember';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import editUser from '@salesforce/apex/AccountTeamHandler.editUser';
import updateUser from '@salesforce/apex/AccountTeamHandler.updateUser';
import findTeamRoleForEdit from '@salesforce/apex/AccountTeamHandler.findTeamRoleForEdit';
import deleteUser from '@salesforce/apex/AccountTeamHandler.deleteUser';
import updateuserbycon from '@salesforce/apex/AccountTeamHandler.updateuserbycon';
import updateuserbeforecon from '@salesforce/apex/AccountTeamHandler.updateuserbeforecon';


export default class AccountTeamCmp extends  NavigationMixin(LightningElement) {

   
    casemodel=false;
    usermodel=false;
    teammodel=false;
    oppmodel=false;
    accessmodel=false;
    edilModel=false;
    imageModel=false;
    @track isModalOpen=false;
    @api recordId;
   @api uId;
    userReturn; 
    error;
    userValue='';
    caseRecord='';
    acess='';
    oppRecord='';
    selectedTeamRole='';
    accteamm;
    errorMsg;
    @track searchKey;
    @track search=[];
    @track teamRole=[];
    accessLevel=[];
    caseAcc=[];
    oppAccess=[];
    accTeamRole=[];
    @api iconId;
    editDetails=[];
    uname='';
    firstName;
    title;
    city;
    street;
    zipCode;
    aboutMe;
    lastName;
    companyName;
    mobile;
    email;
    state;
    country;
    @track updatedUserDetails=[];

//fetching the accountTeammember records details

    @wire(findAccountTeamMember ,{recId:'$recordId'}) rectangle; 




//fetching the picklist access of opportunity
handleOppAccess(event){
    this.oppmodel=true;
    opportunityAccess()
    .then(result=>{
        this.oppAccess=result;
        console.log('user sdifuhertgjvrm==',this.userReturn);
       })
       .catch(error=>{
        this.error=error;
       });
}

searchOppAccess(event){
this.oppRecord=event.currentTarget.dataset.value;
this.oppmodel=false;
}
//fetching the picklist access of case
handleCase(event){
    this.casemodel=true;
    caseAccess()
    .then(result=>{
        this.caseAcc=result;
        console.log('user sdifuhertgjvrm==',this.userReturn);
       })
       .catch(error=>{
        this.error=error;
       });
}
searchCaseAccess(event){
    this.caseRecord=event.currentTarget.dataset.value;
    this.casemodel=false;
}
//fetching the picklist access of account
handleAccess(event){
    this.accessmodel=true;
    accountAccess()
    .then(result=>{
        this.accessLevel=result;
        console.log('user sdifuhertgjvrm==',this.userReturn);
       })
       .catch(error=>{
        this.error=error;
       });
}
searchAccess(event){
this.acess=event.currentTarget.dataset.value;
this.accessmodel=false;
}

//searched picklist value of the teamrole
@wire(findTeamRoleForEdit,{roleId:'$iconId'}) 
wiredTeamMember ({ error, data }) {
    if (data) {
        this.accTeamRole = data; 
        console.log(' this.accTeamRole===', this.accTeamRole);
   } else if (error) { 
       this.error = error;  
  }   }

    handleTeamRole(event){
        this.teammodel=true;
        findTeamRole()
       .then(result=>{
        this.teamRole=result;
        console.log('user sdifuhertgjvrm==',this.userReturn);
       })
       .catch(error=>{
        this.error=error;
       });
    
    }

    searchRole(event){
this.selectedTeamRole=event.currentTarget.dataset.value;
this.teammodel=false;
    }

    selectRole(event){
        this.accTeamRole=event.target.value;
        console.log(' this.accTeamRole===',this.accTeamRole.TeamMemberRole);
    }

    
    handleClick(event)
    {
       this.isModalOpen=true;
       findUserDetails()
       .then(result=>{
        this.userReturn=result;
        console.log('user sdifuhertgjvrm==',this.userReturn);
       })
       .catch(error=>{
        this.error=error;
       });
    
    }

    closeModal(event)
    {
       this.isModalOpen=false;
    }

    handelSearchKey(event)
    {
       this.usermodel=true;
       findUser()
       .then(result=>{
           console.log('return object user',JSON.stringify(result));
      
        this.search=result;
        this.uId=result.Id;
        for(let i=0;i<this.search.length;i++){
            console.log('search user id',this.search.Id);
        }
        console.log('search user id',this.search.Id);
        console.log('user id====>>>>>>>',this.uId);
        console.log('user sdifuhertgjvrm==',JSON.stringify(this.searchKey));
       })
       .catch(error=>{
        this.error=error;
       });
       
   }
    
   searchuser(event)
   {
      this.userValue=event.currentTarget.dataset.value; 
      this.usermodel=false;
     
      this.uId=event.currentTarget.dataset.id; 
      console.log('userfromuserdfoghserioghwt',this.uId);
   }


   //on click of plus icon this method is run to add account teams
createAccountTeamMember(event){
   
    
             let UserId=this.uId;
             let AccountId=this.recordId;
             let userValue = this.userValue;
             let selectedTeamRole = this.selectedTeamRole;
             let acess = this.acess;
             let caseRecord = this.caseRecord;
             let oppRecord =this.oppRecord;
    
      insertAccountTeamMember({uId:UserId,accId:AccountId,teamRole:selectedTeamRole,accAccess:acess,oppAccess:oppRecord,caseAccess:caseRecord})
      .then(result=>{
        refreshApex(this.rectangle);
          console.log('return resukr from apexxxxxxxxx,',result);
          
         
         this.dispatchEvent(
           
            new ShowToastEvent({
               title: 'Toast Success',
               message: 'Added to AccountTeamMember',
               variant: 'success',
               mode: 'dismissable'
              
               
            })  
         ); 
     })
         .catch(error=>{
             this.dispatchEvent(
                new ShowToastEvent({
                   title: 'Not Success',
                   message: 'Error',
                   variant: 'danger'
                }),
             ); 
         });
         this.isModalOpen=false;
 }
 
//when click on edit icon and it populate the previous value in the model
 iconHandler(event){
    this.edilModel=true;
    this.iconId=event.currentTarget.dataset.id;
    this.uname=event.currentTarget.dataset.value;
    console.log('iconId======',this.iconId);
    editUser({editId:this.iconId})
    .then(result=>{
this.editDetails=result;
this.firstName=this.editDetails.FirstName;
this.title=this.editDetails.Title;
this.city=this.editDetails.City;
this.street=this.editDetails.Street;
this.zipCode=this.editDetails.PostalCode;
this.aboutMe=this.editDetails.AboutMe;
this.lastName=this.editDetails.LastName;
this.companyName=this.editDetails.CompanyName;
this.mobile=this.editDetails.MobilePhone;
this.email=this.editDetails.Email;
this.state=this.editDetails.State;
this.country=this.editDetails.Country;

console.log('edit details from apex',this.editDetails);
    })
    .catch(error=>{
        console.log('error in edit',error);
    })

    
 }

 
 firstnameHandler(event){
this.firstName=event.target.value;
console.log(this.firName);
 }
 titlehandler(event){
    this.title=event.target.value;
 }
 strrethandler(event){
    this.street=event.target.value;
 }
 cityHandler(event){
    this.city=event.target.value;
 }
 ziphandler(event){
    this.zipCode=event.target.value;
 }
 aboutmeHandler(event){
    this.aboutMe=event.target.value;
 }
 lastNameHandler(event){
    this.lastName=event.target.value;
 }
 companyHandler(event){
    this.companyName=event.target.value;  
 }
 mobileHandler(event){
    this.mobile=event.target.value;
 }
 emailHandler(event){
    this.email=event.target.value;
 }
 stateHandler(event){
    this.state=event.target.value;
 }
 countryHandler(event){
    this.country=event.target.value;
 }

 //after editing when click on save
 editSaveHandler(event){
    let updateId=this.iconId;
    let fName=this.firstName;
    let lName=this.lastName;
    let strt=this.street;
    let zcode=this.zipCode;
    let abtme=this.aboutMe;
    let cty=this.city;
    let comName=this.companyName;
    let mob=this.mobile;
    let emal=this.email;
    let stte=this.state;
    let conty=this.country;
    let ttle=this.title;
    console.log('firstname',fName);
    console.log('lastname',lName);
    console.log('abtme',abtme);
    console.log('no',mob);
    console.log('strt',strt);
 updateUser({updateId:updateId,firstName:fName,lastName:lName,
    title:ttle,city:cty,street:strt,aboutme:abtme,companyname:comName,
    state:stte,country:conty,mobile:mob,zipcode:zcode,mail:emal})
 .then(result=>{
this.updatedUserDetails=result;
refreshApex(this.rectangle);
console.log('updated field of user',this.updatedUserDetails);
this.edilModel=false;
 })
 .catch(error=>{
console.log('error in updated user',error);
 })
    
    console.log('update id==',updateId);
    console.log('firstname',fName);
    console.log('hi sikandar how r you');
 }
 closeEdilModal(event){
    let fdelete= this.fid;
    this.edilModel=false;
 }

@api photoId;
 photoHandler(event){
this.imageModel=true;
this.photoId=event.currentTarget.dataset.id;
console.log('this.photoId======',this.photoId);
 }


 closeImageModel(event){
    this.imageModel=false;
 }

 get acceptedFormats(){
return '.jpg,.jpeg,.png,.xls, .xlsx';
 } 
fileData;
fileName;
fid;
@api myRecordId;
//for the profile photo chane upload file
handleUploadFinished(event){
    
    const uploadedFiles = event.detail.files[0];
    console.log('uploadedFiles++++++++++',uploadedFiles);
    const fileId = uploadedFiles.documentId;
    this.fid=fileId;
    let ueId=this.iconId;
    console.log('this.photoId============',ueId);
    console.log('pdelId============',this.iconId);
    updateuserbeforecon({communityId:null,uerId:ueId,fileId:this.fid,version:null})
    .then(result=>{
console.log('result===============>>>>',result);
    })
    .catch(error=>{
console.log('error=============',error);
    })
    
}


@api deleId;
deleteHandlerUserModel=false;
deleteHandler(event){
    this.deleteHandlerUserModel=true;
    this.deleId=event.currentTarget.dataset.id; 
    console.log('this.deleteId=====>>>>>',this.deleId);
}
deleteaccTeamHandler(event){
    let dId=this.deleId;
    console.log('===========dId',dId);
    
    deleteUser({deleteId:dId})
    .then(result=>{
         refreshApex(this.rectangle);
    console.log('user is deleted',result);
    })
    .catch(error=>{
        console.log('error to delete',error);
    })
    this.deleteHandlerUserModel=false;   
}

//social icon in the user profile 
closedeleteModal(event){
    this.deleteHandlerUserModel=false;   
}

    icon=[
        {
            id:"1",
            header:"Twitter",
            src:Assignment+'/Assignment/twitter.png',
            href:'https://twitter.com/home'
        },
        {
            id:"2",
            header:"Youtube",
            src:Assignment+'/Assignment/youtube.png',
            href:'https://www.youtube.com/'
        },
        {
            id:"3",
            header:"facebook",
            src:Assignment+'/Assignment/facebook.png',
            href:'https://www.facebook.com/login/'
        },
        {
            id:"4",
            header:"instagram",
            src:Assignment+'/Assignment/instagram.jfif',
            href:'https://www.instagram.com/'
        },
    ]
    navigate(event){
    console.log(':::::',event.currentTarget.dataset.value);
    var navi=event.currentTarget.dataset.value;
        if(navi=='Twitter')
        {
            this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
                attributes: {
                url: 'https://twitter.com/home'
                }
                },
                true 
                );

        }
            
        else if(navi=='Youtube'){
            this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
                attributes: {
                url: 'https://www.youtube.com/'
                }
                },
                true 
                );
        }
        else if(navi=='facebook'){
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: 'https://www.facebook.com/login/'
                }
                },
                true 
                );
        }
        else {
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: 'https://www.instagram.com/'
                }
                },
                true 
                );
        }
           
     }
    }