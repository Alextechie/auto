import request from "supertest";
import { prisma } from "@db/prisma";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { app } from "../../apps/primary-backend"
import { expect } from "bun:test";
import { password } from "bun";


describe('sign up authentication flow', () => {
    beforeAll(async () => {
        await prisma.$connect()
    });

    afterAll(async () => {
        await prisma.user.deleteMany();
        await prisma.$disconnect()
    });

    it('should be able to create a new user given valid credentials', async () => {
        const res = await request(app)
            .post("/api/v1/user/signup")
            .send({
                username: "John Reese",
                email: "leonalexa665@gmail.com",
                password: 'topsecret'
            })

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty("user")
        expect(res.body.user.email).toBe('leonalexa665@gmail.com');

        const userInDb = await prisma.user.findUnique({ where: { email: 'leonalexa665@gmail.com' } });
        expect(userInDb).not.toBeNull()
    });

    it('should reject signup with missing fileds', async () => {
        const res = await request(app)
            .post('/api/v1/user/signup')
            .send({
                email: 'leonalexa665@gmail.com',
            });

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("message")
        expect(res.body.message).toBe('Invalid inputs')
    });

    it('should reject signup with duplicate email', async () => {
        // create a user
        await prisma.user.create({
            data: {
                username: 'duplicate',
                email: 'duplicate@gmail.com',
                password: 'hashedPassword'
            }
        });

        // try creating again
        const res = await request(app)
            .post('/api/v1/user/signup')
            .send({
                username: 'duplicate',
                email: 'duplicate@gmail.com',
                password: 'hashedPassword'
            });

        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty("message")
        expect(res.body.message).toBe('User already exists')
    })
})

describe('sign-in authentication flow with JWT', async () => {
    const userData = {
        username: 'John Reese',
        email: 'leonalexa665@gmail.com',
        password: 'topsecret'
    };


    beforeAll(async () => {
        await prisma.$connect()
    });

    beforeEach(async () => {
        await prisma.user.deleteMany()
        await prisma.user.create({
            data: {
                username: userData.username,
                email: userData.email,
                password: userData.password
            }
        })
    })

    afterAll(async () => {
        await prisma.$disconnect()
        await prisma.user.deleteMany()
    });


    it('should sign in a user if they have the right credentials and set a JWT token in cookie ', async () => {
        const res = await request(app)
            .post('/api/v1/user/signin')
            .send({
                email: userData.email,
                password: userData.password
            });

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('message');
        expect(res.headers['set-cookie']).toBeDefined();

        const cookieHeader = res.headers['set-cookie']
        expect(cookieHeader).toMatch(/token=/)
        expect(res.body.message).toBe('Logged in successfully')

    });

    it('should reject signin if the email doesnt exist', async () => {
        const res = await request(app)
            .post('/api/v1/user/signin')
            .send({
                email: 'testemail@gmail.com',
                password: 'whatever'
            });

        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('User does not exist')
    });

    it('should reject signin if user sends invalid inputs', async () => {
        const res = await request(app)
            .post('/api/v1/user/signin')
            .send({
                email: 2345678976634,
                password: 34343
            });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Invalid Inputs')
    });

    it('should reject signin if passwords do not match', async () => {
        const res = await request(app)
            .post('/api/v1/user/signin')
            .send({
                email: userData.email,
                password: 'hello,world'
            });


        expect(res.status).toBe(409);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toBe('Your password does not match')
    })
})