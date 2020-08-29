const { hash, compare } = require('../helpers/bcrypt');
const httpResponse = require('../helpers/httpResponse');
const { sign, verify } = require('../helpers/jwt');

function Controller ({ makeDb }) {
    return Object.freeze({
        signUp,
        login,
        updateUser
    });

    async function signUp ({ email, password, confirmPassword, subscription = 'FREE' }) {
        if (password !== confirmPassword) {
            throw Error('Passwords do not match');
        }

        const sub = subscription.toUpperCase();
        const hashedPassword = hash(password);
        const text = `
            INSERT INTO users (email, password, subscription)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const query = {
            text,
            values: [email, hashedPassword, sub]
        };

        try {
            let db = makeDb();
            let user = await db.query(query);
            user = user.rows[0];

            // Dont send password back to client
            delete user.password;
            let jwt = sign(user.email);
                
            // Asign JWT to user object
            user.token = jwt;

            return httpResponse({ 
                success: true,
                statusCode: 200,
                data: user,
                clientMessage: 'Success!'
            });
        }catch (error) {
            return httpResponse({
                success: false,
                statusCode: 400,
                data: error,
                clientMessage: 'That email may already be taken. Please try again.'
            });
        }
    }

    async function login ({ email, password }) {
        const text = 'SELECT * FROM users WHERE email = $1';
        const query = {
            text,
            values: [email]
        };
        
        try {
            let db = makeDb();
            let user = await db.query(query);
            user = user.rows[0];

            // If true, login
            if (compare(password, user.password)) {
                // Dont send password back to client
                delete user.password;
                let jwt = sign(user.email);
                
                // Asign JWT to user object
                user.token = jwt;

                // Send back user to client
                return httpResponse({ 
                    success: true,
                    statusCode: 200,
                    data: user,
                    clientMessage: 'Success!'
                });
            }

           // Send back user to client
            return httpResponse({ 
                success: false,
                statusCode: 400,
                data: '',
                clientMessage: 'Email or password is incorrect. Please try again.'
            });

        }catch (error) {
            return httpResponse({
                success: false,
                statusCode: 400,
                data: error,
                clientMessage: 'Please try again.'
            });
        }
    }

    async function updateUser ({ email, password = null, confirmPassword = null, subscription = null }) {
        // Check password
        if (password && password !== confirmPassword) {
            throw Error('Passwords do not match');
        }

        const text = `
            UPDATE users SET
                password = COALESCE($1, password),
                subscription = COALESCE($2, subscription)
            WHERE
                email = $3
            RETURNING *;
        `;
        const query = {
            text,
            values: [hash(password), subscription, email]
        };

        try {
            let db = makeDb();
            let user = await db.query(query);
            user = user.rows[0];

            // Dont send password back to client
            delete user.password;
            
            // Send back user to client
            return httpResponse({ 
                success: true,
                statusCode: 200,
                data: user,
                clientMessage: 'Success!'
             });
        }catch (error) {
            return httpResponse({
                success: false,
                statusCode: 400,
                data: error,
                clientMessage: 'Could not update your account. Please try again or reach out to support.'
            });
        }
        
    }
}

module.exports = Controller;