import "dotenv/config";

import readline from "readline";

import {
    PrismaClient,
    Role
} from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

import { auth } from "../src/modules/auth/auth.js";


const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});


const prisma = new PrismaClient({
    adapter,
});



function ask(question: string) {

    return new Promise<string>((resolve) => {

        const rl = readline.createInterface({

            input: process.stdin,
            output: process.stdout

        });


        rl.question(question, (answer) => {

            rl.close();

            resolve(answer.trim());

        });


    });

}



async function main() {


    console.log(`
================================
 OnePips Super Admin Creation
================================
 `);



    /**
     * Vérification verrou
     *
     * On vérifie en base
     * qu'aucun super admin existe
     */


    const superAdminExists =
        await prisma.superAdmin.count();


    if (superAdminExists > 0) {

        console.error(
            "ERREUR : Un SUPER_ADMIN existe déjà."
        );

        process.exit(1);

    }




    const email =
        await ask(
            "Email Super Admin : "
        );



    const password =
        await ask(
            "Mot de passe Super Admin : "
        );





    /**
     * Création via Better Auth
     *
     * Le hash du password
     * est géré par Better Auth
     */


    const result =
        await auth.api.signUpEmail({

            body: {

                email,

                password,

                name: "Super Admin"

            }

        });



    if (!result.user) {

        throw new Error(
            "Création Better Auth impossible"
        );

    }




    const userId =
        result.user.id;




    /**
     * Promotion SUPER_ADMIN
     */


    await prisma.user.update({

        where: {

            id: userId

        },


        data: {

            role: Role.SUPER_ADMIN,

        }

    });





    /**
     * Création du verrou SuperAdmin
     */


    await prisma.superAdmin.create({

        data: {

            userId

        }

    });





    console.log(`

 SUPER ADMIN créé

 Email:
 ${email}

 ID:
 ${userId}

 `);



}



main()

    .catch(error => {

        console.error(error);

        process.exit(1);

    })


    .finally(() => {

        prisma.$disconnect();

    });