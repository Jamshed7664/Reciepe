export class UserModel {
  constructor(
    public email:string,
    public id :string,
    private _token:string,
    private _expirationDate:Date
  ){}

  get token(){
if(!this._token || new Date > this._expirationDate){
  return null;
}else{
  return this._token
}
  }
}

