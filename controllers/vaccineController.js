const Kid       = require('../models/Kid');
const Vaccine   = require('../models/Vaccine');

exports.createSusVaccines = async (req) => { SusVaccines(req) }

const SusVaccines = async (req) => {
    const {_id, birth}  = req;
    const birthDay      = new Date(birth).getDate()

    let newSUS

    try {
        for (let index = 0; index < susVaccines.length; index++) {
            //console.log(susVaccines[index])
            newSUS = new Vaccine({
                dueMonth:       susVaccines[index].dueMonth,
                scheduleDate:   birth, // <<<<
                name:           susVaccines[index].name,
                description:    susVaccines[index].description,
                isSUS:          true,
                isSet:          false,
                kid:            _id
            })
            console.log(newSUS)
            // await newSUS.save()
        }
     } catch (err){
        console.log(err)
        return err;
    }

    function addOneMonth (d) {
        let day = birthDay
        let month = d.getMonth() + 1
        let year = d.getFullYear()

        if (month > 11) {
            month = 0
            year++
        } else {
            if (day > 28) {
                switch (month) {
                    case 1:
                        day = 28;
                        break;
                    case 3:
                    case 5:
                    case 8:
                    case 10:
                        if (day > 30) { day = 30 }
                        break;
                }
            }
        }
        return new Date(year, month, day);
    }
}

const susVaccines = [
                        {
                            dueMonth:       0,
                            name:           "BCG (dose única)",
                            description:    "Contra as formas graves da tuberculose (miliar e meníngea) (bacilo de Calmette-Guérin). \n Deverá ser aplicada o mais precocemente possível, de preferência ainda na maternidade, em recém-nascidos com peso maior ou igual a 2.000 g."
                        },
                        {
                            dueMonth:       0,
                            name:           "Hepatite B (dose ao nascer)",
                            description:    "Previne contra hepatite B (recombinante). \n Aplicar a primeira dose nas primeiras 12 horas de vida"
                        },
                        {
                            dueMonth:       2,
                            name:           "Pentavalente (1ª dose)",
                            description:    "Previne contra difteria, tétano, coqueluche pertussis, hepatite B (recombinante) e Haemophilus influenzae b (conjugada)."
                        },
                        {
                            dueMonth:       2,
                            name:           "VIP (1ª dose)",
                            description:    "Vacina Inativada Poliomielite 1, 2 e 3"
                        },
                        {
                            dueMonth:       2,
                            name:           "Pneumocócica 10V (conjugada) (1ª dose)",
                            description:    "Previne contra meningite, pneumonia e otite média aguda."
                        },
                        {
                            dueMonth:       2,
                            name:           "Rotavírus Humano (atenuada) (1ª dose)",
                            description:    "Previne contra rotavírus humano G1P1"
                        },
                        {
                            dueMonth:       3,
                            name:           "Meningocócica C (conjugada) (1ª dose)",
                            description:    ""
                        },
                        {
                            dueMonth:       4,
                            name:           "Pentavalente (2ª dose)",
                            description:    "Previne contra difteria, tétano, coqueluche pertussis, hepatite B (recombinante) e Haemophilus influenzae b (conjugada)."
                        },
                        {
                            dueMonth:       4,
                            name:           "VIP (2ª dose)",
                            description:    "Vacina Inativada Poliomielite 1, 2 e 3"
                        },
                        {
                            dueMonth:       4,
                            name:           "Pneumocócica 10V (conjugada) (2ª dose)",
                            description:    "Previne contra meningite, pneumonia e otite média aguda."
                        },
                        {
                            dueMonth:       4,
                            name:           "Rotavírus Humano (atenuada) (2ª dose)",
                            description:    "Previne contra rotavírus humano G1P1"
                        },
                        {
                            dueMonth:       5,
                            name:           "Meningocócica C (conjugada) (2ª dose)",
                            description:    ""
                        },
                        {
                            dueMonth:       6,
                            name:           "Pentavalente (3ª dose)",
                            description:    "Previne contra difteria, tétano, coqueluche pertussis, hepatite B (recombinante) e Haemophilus influenzae b (conjugada)."
                        },
                        {
                            dueMonth:       6,
                            name:           "VIP (3ª dose)",
                            description:    "Vacina Inativada Poliomielite 1, 2 e 3"
                        },
                        {
                            dueMonth:       9,
                            name:           "Febre Amarela (dose única)",
                            description:    ""
                        },
                        {
                            dueMonth:       12,
                            name:           "Meningocócica C (conjugada) (reforço)",
                            description:    ""
                        },
                        {
                            dueMonth:       12,
                            name:           "Pneumocócica 10V (conjugada) (reforço)",
                            description:    "Previne contra meningite, pneumonia e otite média aguda."
                        },
                        {
                            dueMonth:       12,
                            name:           "Tríplice Viral (dose única)",
                            description:    "Previne contra sarampo, caxumba e rubéola."
                        },
                        {
                            dueMonth:       15,
                            name:           "DTP (1º reforço)",
                            description:    "Previne contra Difteria (crupe), Tétano, Pertussis (tríplice bacteriana), coqueluche, poliomelite e infecções causadas por Haemophilus influenza tipo B."
                        },
                        {
                            dueMonth:       15,
                            name:           "VOP (atenuada) (1º reforço)",
                            description:    "Vacina Oral Poliomielite, previne contra poliomelite 1 e 3."
                        },
                        {
                            dueMonth:       15,
                            name:           "Hepatite A (inativada) (dose única)",
                            description:    ""
                        },
                        {
                            dueMonth:       15,
                            name:           "Tetra Viral (atenuada) (dose única)",
                            description:    "Previne contra sarampo, caxumba, rubéola e varicela."
                        },
                        {
                            dueMonth:       24,
                            name:           "Pneumocócica 23V (conjugada)",
                            description:    "Disponível no SUS somente para POVOS INDÍGENAS. Previne contra protege contra doenças graves causadas pela bactéria pneumococo, como pneumonias, meningites e outras."
                        },
                        {
                            dueMonth:       48,
                            name:           "DTP (2º reforço)",
                            description:    "Previne contra Difteria (crupe), Tétano, Pertussis (tríplice bacteriana), coqueluche, poliomelite e infecções causadas por Haemophilus influenza tipo B."
                        },
                        {
                            dueMonth:       48,
                            name:           "VOP (atenuada) (2º reforço)",
                            description:    "Vacina Oral Poliomielite, previne contra poliomelite 1 e 3."
                        },
                        {
                            dueMonth:       48,
                            name:           "Varicela (atenuada) (dose única)",
                            description:    ""
                        },
                    ]