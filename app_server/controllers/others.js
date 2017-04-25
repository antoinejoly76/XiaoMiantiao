module.exports.about= function(req, res) {
    res.render('about' ,
            {title: 'About',
            pageHeader: {
                title: 'XiaoMiantiao',
                strapline: 'Simple Chinese dictionary using the MEAN stack',
                footercontent: 'All content © 2017 by Antoine Joly'
            }
        });
};
