'use strict';

module.exports = function(User) {

  User.observe('after save', function setRoleMapping(ctx, next) {

    var RoleMapping = User.app.models.RoleMapping;
    var Role = User.app.models.Role;

    if (ctx.instance) {
      if(ctx.isNewInstance) {

        Role.create({name: 'supplier'}, function(err, role) {
          if (err) {
            return console.log(err);
          }

          RoleMapping.create({
            principalType: "USER",
            principalId: ctx.instance.id,
            roleId: role.id
          }, function(err, roleMapping) {

            if (err) {return console.log(err);}

            console.log('User assigned RoleID ', roleMapping);

          });

        });

      }
    }
    next();
  });

};
