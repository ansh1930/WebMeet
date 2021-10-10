const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
require('../DataBase/connect')
const WebMeet_credentials = require('../Model/Schema')


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callbackURL: "http://localhost:8001/done"
    callbackURL:process.env.CALLBACK_URLL+'/done',
    // proxy:true,
  },
  async function(accessToken, refreshToken, profile, done) {
    // console.log("access "+ accessToken)
    // console.log('refresh '+refreshToken)
    // console.log('profile '+profile._json)
    console.log('profile '+profile.id)
    console.log('profile '+profile.displayName)
    // console.log('profile '+profile._json.name
    // console.log('profile '+profile._json.email)
    console.log('profile '+profile._json.Gender)
    // console.log('profile '+profile.provider)

    const Id = profile.id
    const Displayname = profile.displayName
    const Name = profile._json.name
    const Email = profile._json.email
    const provider = profile.provider
    const Gender = profile._json.gender

    WebMeet_credentials.findOne({GoogleId:Id}).then(async user=>{
      
      if (user) {
        
      console.log(user)
      done(null,user)
        
      } else {
        await new WebMeet_credentials({
          GoogleId:Id,
          DisplayName:Displayname,
          Name:Name,
          Email:Email,
          Provider:provider
        }).save()

        WebMeet_credentials.findOne({GoogleId:Id}).then(async user=>{
         console.log("Register: "+user)
         done(null,user)
       })
       
       
      }
    })
    

  }))

passport.serializeUser((user,done)=>{
  console.log('user:  '+user)
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
  WebMeet_credentials.findById(id, (err,user)=>{
    done(err,user)
    console.log("user de: "+user)
})

})
