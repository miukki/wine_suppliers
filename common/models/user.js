'use strict';

module.exports = function(User) {

  User.observe('after save', function setRoleMapping(ctx, next) {

    var RoleMapping = User.app.models.RoleMapping;
    var Role = User.app.models.Role;

    if (ctx.instance) {
      if(ctx.isNewInstance) {

        Role.find({where: {name: 'supplier'}}, function(err, roles) {
          if (err) {
            return console.log(err);
          }

          if (roles.length === 0) {
            return console.log('Role supplier not found');
          }

          var role = roles[0];

          RoleMapping.create({
            principalType: "USER",
            principalId: ctx.instance.id,
            roleId: role.id
          }, function(err, roleMapping) {

            if (err) {return console.log(err);}

            console.log('User assigned RoleID ', role.id, role.name);

          });

        });

      }
    }
    next();
  });

};
