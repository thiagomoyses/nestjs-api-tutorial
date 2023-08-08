import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import * as pactum from 'pactum';

describe('App end2end', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    
    prisma = moduleRef.get<PrismaService>(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
    
    await app.init();
    await app.listen(3333);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Auth', () => {

    const dto: AuthDto = {
      email: 'spectest@teste.com',
      password: '123',
    };

    describe('Signup', () => {
      it('Should show an error for empty email', () => {
        const doTheTest = pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password
          })
          .expectStatus(400);

        return doTheTest;
      });

      it('Should show an error for empty password', () => {
        const doTheTest = pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.email
          })
          .expectStatus(400);

        return doTheTest;
      });

      it('Should show an error for empty body', () => {
        const doTheTest = pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);

        return doTheTest;
      });

      it('Should Signup', () => {

        const doTheTest = pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);

        return doTheTest;
      });

    });

    describe('Signin', () => {

      it('Should show an error for empty email', () => {
        const doTheTest = pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password
          })
          .expectStatus(400);

        return doTheTest;
      });

      it('Should show an error for empty password', () => {
        const doTheTest = pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.email
          })
          .expectStatus(400);

        return doTheTest;
      });

      it('Should show an error for empty body', () => {
        const doTheTest = pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);

        return doTheTest;
      });

      it('Should Signin', () => {
        let doLogin = pactum
        .spec()
        .post('/auth/signin')
        .withBody(dto)
        .expectStatus(200).stores('userAt', 'access_token');

        return doLogin;
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('Should get current user', () => {
        let doTest = pactum
        .spec()
        .get('/users/me')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        })
        .expectStatus(200);

        return doTest;
      });
    });

    describe('Edit user', () => {});
  });

  describe('Bookmarks', () => {
    describe('Create Bookmark', () => {});

    describe('Get Bookmarks', () => {});

    describe('Get Bookmark By Id', () => {});

    describe('Edit Bookmark', () => {});

    describe('Delete Bookmark By Id', () => {});
  });
});
