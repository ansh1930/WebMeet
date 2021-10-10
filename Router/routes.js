// const { json } = require('express')
const express = require('express')
const passport = require('passport')
const Router = express.Router()
const { v4: uuidV4 } = require('uuid')
const body_parser = require('body-parser')
const ids = require('../Room_IDS');
// const con = require('../Config/mysql')

Router.use(body_parser.urlencoded({ extended: false }))
Router.use(body_parser.json())




Router.get('/', (req, res) => {
    if (req.user == null) {

        res.render('Home', { generate_id: uuidV4(), LoginedIn: false, Loginout: true, Name: '', Email: '', Message: null, Alert: false })
    }
    else {

        // console.log("home : " +req.user[0].Name)

        res.render('Home', { generate_id: uuidV4(), Message: null, Alert: false, LoginedIn: true, Loginout: false, Name: req.user.Name, Email: req.user.Email })
    }
})



Router.get('/Room', (req, res) => {
    res.redirect(`Room/${uuidV4()}`)
})


Router.post('/validate', (req, res) => {
    if (req.user == null) {

        res.redirect('/auth/google');
    }
    else {
        // console.log(req.body)
        console.log("User Provide Room ID " + req.body.Join_meeting)
        const join_id = req.body.Join_meeting
        // let IDs =['hjgfghjfhchg']
        if (ids.includes(join_id)) {
            console.log("Present")
            res.redirect('/Room/' + req.body.Join_meeting)

        } else {

            if (req.user == null) {

                res.render('Home', { Alert: true, Message: 'Room is Not Present', LoginedIn: false, Loginout: true, generate_id: uuidV4(), Name: '', Email: '' })
            } else {
                res.render('Home', { generate_id: uuidV4(), Alert: true, Message: 'Room is Not Present', LoginedIn: true, Loginout: false, Name: req.user.Name, Email: req.user.Email })

            }

            // console.log("not Present")

        }
    }
    // res.end("heloo")
})


// Router.post('/contact', (req, res) => {
//     if (req.user == null) {
//         res.redirect('/auth/google')
//     } else {
//         console.log(req.body)
//         const email = req.body.Email;
//         const name = req.body.Name;
//         const message = req.body.Message;

//         // let insert ="INSERT INTO `contactus` (`Name`, `Email`, `Message`) VALUES ('"+name+"', '"+email+"', '"+message+"'); "

//         // con.query(insert,async(err,done)=>{
//         //     if(err){
//         //         throw err
//         //     }else{
//         //         console.log("done : "+done.Name)
//         //         res.redirect('/')
//         //     }
//         // })
//     }
// })

Router.post('/add_id', (req, res) => {
    if (req.user == null) {

        res.redirect('/auth/google');

    }
    else {
        console.log("Created Room ID : " + req.body.create_meeting);
        const create_room = req.body.create_meeting
        if (!ids.includes(create_room)) {

            ids.push(create_room);
            console.log("Array : " + ids);

            res.redirect('/Room/' + req.body.create_meeting)
        } else {
            if (req.user == null) {
                res.render('Home',
                    { Alert: true, Message: 'Room is Not Present', LoginedIn: false, Loginout: true, generate_id: uuidV4(), Name: '', Email: '' })
                console.log("Room Id is already Present ")
            } else {
                res.render('Home', { generate_id: uuidV4(), Alert: true, Message: 'Room Id is already Present', LoginedIn: true, Loginout: false, Name: req.user.Name, Email: req.user.Email })
                console.log("Room Id is already Present ")
            }

        }
    }
    // res.end('validateeeee')
})


Router.get('/Room/:room', (req, res) => {
    if (req.user == null) {
        res.redirect('/auth/google')
    }
    else {

        if (ids[0] == null) {
            console.log("Array is empty")
        } else {
            setTimeout(function () {
                ids.splice(0, 1);
                console.log("Array : " + ids)
                res.render('Home', { Alert: true, Message: 'Room Id is Expriey' })
            }, 1000 * 60 * 60); //for 1 hours
        }

        res.render('room', { roomId: req.params.room, Username: req.user.Name })
    }
})



// Router.get('/auth/google',passport.authenticate('google',
// {scope: [ 'email','profile' ] }))

Router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

// Router.get('/done',
// passport.authenticate('google',{failureRedirect: '/error'}),

// (req,res)=>{
//     // console.log("google login done")
//     res.redirect('/')
// }

// )

// Router.get('/done', 
//   passport.authenticate('google', { failureRedirect: '/error',successRedirect:'/' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });



Router.get('/error', (req, res) => {
    res.end("google error")
})

Router.get('/done',
    passport.authenticate('google',
        {
            failureRedirect: '/',
            successRedirect: '/',
        }))

// Router.get('/done',
// passport.authenticate('google',{
//     successRedirect:'/',
//     failureRedirect: '/error'
// }))

Router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})








// For Covid Website
Router.get('/createmeetingforcovidweb',(req,res)=>{
	console.log("hello covid");
    let covid_meeting_id = uuidV4();
    if(!ids.includes(covid_meeting_id)){
        ids.push(covid_meeting_id);
        console.log(ids)
        return res.json({Meeting_ID : covid_meeting_id})
        
    }else{
        console.log("cannnot register the meeting ID")
    }
})



module.exports = Router

