import {Elysia} from 'elysia';
import {initializeTenancyMiddleware} from 'node-tenancy';
import {connect} from "elysia-connect-middleware";
import {getUsersCount} from "../controllers/UserController";

export const APIRoutes = new Elysia({prefix: '/api'})
    .use(connect(initializeTenancyMiddleware))
    .get('/users', getUsersCount)
    .onError(({error, code}) => {
        if (code === 404) {
            return 'Route not found';
        } else {
            return error;
        }
    });
