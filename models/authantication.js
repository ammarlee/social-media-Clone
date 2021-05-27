module.exports = (req,resp,next)=>{
    if (!req.session.isAuthanticated) {
        console.log(`there is no user ever >>>>>>>>>>>>>>`);
      return  resp.redirect('/')
        
    }
    console.log(`there is  user  >>>>>>>>>>>>>>!!!!!!`);
    next()
}