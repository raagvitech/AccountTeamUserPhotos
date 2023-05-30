public with sharing class AccountTeamHandler {
   
    @AuraEnabled(cacheable=true)
    public static List<AccountTeamMember> findAccountTeamMember(String recId){
      
      List<AccountTeamMember> acct=[SELECT AccountId, Id, User.Name, User.FullPhotoUrl,
                                    User.AboutMe, TeamMemberRole 
                                    FROM 
                                    AccountTeamMember 
                                    WHERE AccountId=:recId] ;


                                 
        System.debug('wert'+ acct);
        for(AccountTeamMember a:acct){
   
           System.debug('acctfwetjmname'+a.User.Name); 
        }
        
   return acct;
    }

    @AuraEnabled(cacheable=true)
    public static  List<AccountTeamMember> findTeamRole(){
      List<AccountTeamMember> tRole=[SELECT Id, TeamMemberRole FROM AccountTeamMember];
      RETURN tRole;
    }

    @AuraEnabled
   public static List<User> findUser(){
      List<User> userName=[select Id,Name from User];
      RETURN userName;
   }
   @AuraEnabled
   public static List<AccountTeamMember> accountAccess(){
      List<AccountTeamMember> access=[SELECT Id, AccountAccessLevel FROM AccountTeamMember];
      System.debug('account acccc'+access);
      RETURN access;
   }
   @AuraEnabled
   public static List<AccountTeamMember> caseAccess(){
      List<AccountTeamMember> caseAccess=[SELECT Id, CaseAccessLevel FROM AccountTeamMember];
      RETURN caseAccess;
   }
   @AuraEnabled
   public static List<AccountTeamMember> opportunityAccess(){
      List<AccountTeamMember> oppAccess=[SELECT Id, OpportunityAccessLevel FROM AccountTeamMember];
      RETURN oppAccess;
   }

   @AuraEnabled
   public static void insertAccountTeamMember(String uId,String accId,String teamRole,String accAccess,String oppAccess,String caseAccess){
      // System.debug('accData ======'+accData);
      System.debug('UserIs'+uId);
      System.debug('UserIs'+accId);
      System.debug('UserIs'+teamRole);
      System.debug('UserIs'+accAccess);
       AccountTeamMember atm=new AccountTeamMember();
     
         atm.AccountId =accId;
         atm.UserId=uId;         
         atm.TeamMemberRole=teamRole;
         atm.AccountAccessLevel =accAccess;
         atm.OpportunityAccessLevel = oppAccess;
   
        atm.CaseAccessLevel =caseAccess;
         insert atm;
         System.debug('atmsdgsergtr'+atm);
        
       }
   
   
   @AuraEnabled
   public static User editUser(String editId){
      System.debug('userId'+editId);
            User userDetails=[SELECT Id, LastName,
            FirstName, CompanyName, Title, Street, 
            City, State, PostalCode, Country, Email,
            Address, MobilePhone, AboutMe 
            FROM 
            User 
            WHERE
            Id = :editId LIMIT 1];
      System.debug('edituser=====' +userDetails);
      return userDetails;
       
   }
   @AuraEnabled
  public static User updateUser(string updateId,String firstName,String lastName,
  String title,String city,String street,String aboutme,string companyname,
  String state,string country,String mobile,String zipcode,String mail){
   System.debug('userid'+updateId);
   System.debug('firtname'+firstName);
   System.debug('lastname'+lastName);
   System.debug('abtme'+aboutme);
   System.debug('no'+mobile);


   User userupdate=[SELECT Id, LastName,
   FirstName, CompanyName, Title, Street, 
   City, State, PostalCode, Country, Email,
   Address, MobilePhone, AboutMe 
   FROM 
   User Where Id=:updateId];
   System.debug('fetch user details'+userupdate);
   userupdate.FirstName=firstName;
   userupdate.LastName=lastName;
   userupdate.CompanyName=companyname;
   userupdate.Title=title;
   userupdate.Street=street;
   userupdate.City=city;
   userupdate.State=state;
   userupdate.PostalCode=zipcode;
   userupdate.Country=country;
   userupdate.Email=mail;
   userupdate.MobilePhone=mobile;
   userupdate.AboutMe=aboutme;
   UPDATE userupdate;
 
   System.debug('updated user record '+userupdate);
   RETURN userupdate;
  }
  @AuraEnabled(cacheable=true)
  public static  List<AccountTeamMember> findTeamRoleForEdit(string roleId){
    List<AccountTeamMember> tRole=[SELECT Id,UserId, TeamMemberRole FROM AccountTeamMember WHERE UserId=:roleId];
    RETURN tRole;
  }

  @AuraEnabled
  public static User updateUserPhoto(String updtId,String updateProfile){
   System.debug('updated user id ====++++'+updtId);
   System.debug('updated user id ====++++'+updtId);
   User updatePhoto=[SELECT Id, SmallPhotoUrl FROM User WHERE Id=:updtId];
   // updatePhoto.MediumPhotoUrl=updateProfile;
   UPDATE updatePhoto;
   return updatePhoto;
  }
  
  @AuraEnabled
  public static AccountTeamMember deleteUser(String deleteId){
   System.debug('received id for delete'+deleteId);
   AccountTeamMember delUser=[SELECT PhotoUrl, UserId, Id FROM AccountTeamMember where UserId=:deleteId];
   delete delUser;
   return delUser;
  }
  @AuraEnabled
 public static  List<AccountTeamMember> updateuserbycon(String communityId,String UserId, String fileId, Integer version)
{
   System.debug('=====UserId+'+UserId);
  // System.debug('accid================'+accid);
   String accid = '0015i00000Y8e1EAAR';
   
   ConnectApi.UserProfiles.setPhoto(communityId, UserId, fileId,version);
   user u=[Select Id,FullPhotoUrl from User where Id=:UserId];
   update u;
   List<AccountTeamMember> acct=[SELECT AccountId, Id, User.Name, User.FullPhotoUrl,
                                 User.AboutMe, TeamMemberRole 
                                 FROM 
                                 AccountTeamMember 
                                 WHERE AccountId=:accid] ;
      return acct;
}
  @AuraEnabled
public static void deleteUserPhoto(String communityId, String delphouserId){
   ConnectApi.UserProfiles.deletePhoto(communityId, delphouserId);
   user u=[Select Id,FullPhotoUrl from User where Id=:delphouserId];
   update u;
}
@AuraEnabled
public static void updateuserbeforecon(String communityId,String uerId, String fileId, Integer version){
   ConnectApi.UserProfiles.setPhoto(communityId, uerId, fileId,version);

}  
}