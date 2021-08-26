app.use('/register', checkRegisterInfo,
    (req, res) => {
        res.render('registration');
    })

app.use('/', (req, res) => {
    res.render('index');
})

app.use((err, req, res) => {
    res.end('Problem...');
    console.log(err);
});