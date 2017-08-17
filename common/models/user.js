var path = require('path');

module.exports = function (User) {

  /**
   * Default action after create new user
   */
  User.observe('after save', function setRoleMapping(ctx, next) {

    var RoleMapping = User.app.models.RoleMapping;
    var Role = User.app.models.Role;

    if (ctx.instance) {
      if (ctx.isNewInstance) {

        Role.find({where: {name: 'supplier'}}, function (err, roles) {
          if (err) {
            return console.log(err);
          }

          if (roles.length === 0) {
            return console.log('Role supplier not found');
          }

          var role = roles[0];

          RoleMapping.create({
            principalType: RoleMapping.USER,
            principalId: ctx.instance.id,
            roleId: role.id
          }, function (err, roleMapping) {

            if (err) {
              return console.log(err);
            }

            console.log('User assigned RoleID ', role.id, role.name);

          });

        });

      }
    }
    next();
  });

  /**
   * Email verification
   */
  User.afterRemote('create', function (context, user, next) {

    var options = {
      type: 'email',
      to: user.email,
      from: 'noreply@loopback.com',
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: '/',
      user: user
    };

    user.verify(options, function (err, response) {
      if (err) {
        User.deleteById(user.id);
        return next(err);
      }

      console.log('> verification email sent:', response, JSON.stringify(response.email.response.toString()));

      var replacementText = "check email";

      context.result.verificationToken = replacementText;

      next();
    });

  });


  // Method after verify
  User.afterRemote('prototype.verify', function(context, user, next) {
    context.res.body = {
      title: 'A Link to reverify your identity has been sent to your email successfully',
      content: 'Please check your email and click on the verification link before logging in',
      redirectTo: '/',
      redirectToLinkText: 'Log in'
    };

    next();
  });

};
