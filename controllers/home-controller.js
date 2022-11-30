const Habbit = require('../models/habbits');  // require habbit db
const User = require('../models/user');     // require user db
const path = require('path');               // require path


// date to string function => eg : jan 1, 2022 -> "112022"
function getTodayDate() {
    let d = new Date();
    let date = d.getDate().toString() + d.getMonth().toString() + d.getFullYear().toString()
    return date
}


// home controller
module.exports.home = async (req, res) => {
    try {

        // if user logged in 
        if (req.cookies.user_id) {
            let user = await User.findById(req.cookies.user_id);            // find user
            let habbits = await Habbit.find({ user: req.cookies.user_id })
            let habbit_content= habbits.map((element)=>{
                return element.content;
            })
            res.locals.habbits = habbit_content;
            // render home page with logged in user and assosiated habits
            return res.render("home", {
                title: "Habbit Tracker",
                habbits: habbits,
                user: user,
                date: await getTodayDate(),
                habbit_list:habbit_content,
            });
        } else {    // if user not logged in
            // redirect to signin page
            return res.redirect('/signin');
        }

    } catch (err) {
        console.log(err)
    }
}


// create habbit controller
module.exports.createHabbit = async (req, res) => {
    try {

        let habbit
        let user
        try {
            // find logged in user 
            user = await User.findById(req.cookies.user_id).populate();
            // if habbit exesists find it 
            habbit = await Habbit.findOne({ content: req.body.habbit, user: user.id }).populate();
        } catch (err) {
            console.log(err)
        }

        // if habbit exesist
        if (habbit) {
            // dont create it 
            
        } else {
        // if habbit nor exesist | create it

            // create new habbit
            let habbits = await Habbit.create({
                content: req.body.habbit,
                user: user._id,
                dates: { date: await getTodayDate(), status: "Un-marked" }
            })
            // add new habbit to user-> habits array
            user.habbits.push(habbits.id);
            user.save();
        }

        // redirect home
        return res.redirect('/');


    } catch (err) {
        console.log(err)
    }
}

// delete habbit controller
module.exports.deleteActivity = async (req, res) => {
    try {
        // find logged in user
        let user = await User.findById(req.cookies.user_id).populate();
        if (user.id) { //if user exesist 
            // delete the activity
            await Habbit.findByIdAndDelete(req.params.id);
            // pull it from user-> activity array
            user.habbits.pull(req.params.id);
            user.save();
        }

        // redirect back
        return res.redirect('back');

    } catch (err) {
        console.log(err)
    }

}

// mark as done, not done or un-marked

module.exports.markDoneNotDone = async (req, res) => {
    try {
        // get id, date, status from request.query
        let id = req.query.id;
        let date = req.query.date;
        let status = req.query.status
        // find habbit
        let habbit = await Habbit.findById(id).populate();

        // if status == new-status
        if (status == "new-status") {
            // add new date and status as done
            habbit.dates.push({
                date: date,
                status: "done"
            })
            habbit.save();

        } else {
            // iterate over dates in habbit 
            for (let i = 0; i < habbit.dates.length; ++i) {
                // find thr current date
                if (habbit.dates[i].date == date) {
                    // if status if done | mark it as not-done
                    if (habbit.dates[i].status == "done") {
                        habbit.dates[i].status = "Not-Done"
                    // if status if not-done | mark it as Un-marked
                    } else if (habbit.dates[i].status == "Not-Done") {
                        habbit.dates[i].status = "Un-marked"

                    // if status if un-marked | mark it as done
                    } else {
                        habbit.dates[i].status = "done"
                    }
                    break;
                }
            }
            habbit.save();
        }
        // redirect back
        return res.redirect('back');

    } catch (err) {
        console.log(err)
    }
}

// weekly report
module.exports.weeklyreport = async (req, res) => {
    try {

        // if user logged in
        if (req.cookies.user_id) {
            // find habits assosiated to user
            let habbits = await Habbit.find({ user: req.cookies.user_id })
            let user = await User.findById(req.cookies.user_id);
            // render weekly-report ans pass the habits and user
            return res.render('weekly-report', {
                title: "habbit Tracker | Weekly Report",
                habbits: habbits,
                user: user.email
            })
        } else {
            return res.redirect('/login')
        }

    } catch (err) {
        console.log(err)
    }
}