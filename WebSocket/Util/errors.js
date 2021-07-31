const errors = (data) => ({
    auth: 'Vous ne pouvez accéder à cette fonctionnalité, reconnectez vous.',
    noname: "Le champs 'nom du chat' est obligatoire",
    notfound: `Aucun chat avec le nom ${data.room.name} n'existe`,
});

module.exports = errors;
