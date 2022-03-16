// import {
//     CanActivate,
//     ExecutionContext,
//     UnauthorizedException,
// } from "@nestjs/common";
// import { Configuration, V0alpha1Api } from '@ory/kratos-client';
// // https://github.com/JulienTD/nestjs-kratos/blob/master/src/middlewares/guard.middleware.ts
// // https://github.com/atls/nestjs/tree/master/packages
// // https://github.com/atls/nestjs/tree/master/packages/kratos/integration/test
// // https://github.com/search?q=nestjs-kratos
// // https://github.com/ory/kratos-selfservice-ui-react-nextjs
// // https://github.com/ory/sdk/tree/master/clients/kratos/typescript
// export class SessionGuard implements CanActivate {
//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const httpContext = context.switchToHttp();
//         const request = httpContext.getRequest();
//         const response = httpContext.getResponse();
//         const kratos = new V0alpha1Api(
//             new Configuration({ basePath: config.kratos.public })
//         )
//         try {
//             const session = await kratos
//                 .toSession(undefined, request.header('Cookie'))
//             console.log(session);
//             (request as Request & { user: any }).user = { session };
//             return true
//         } catch (e) {
//             response.redirect("/login");
//         }
//     }
// }

export class OrySessionGuard{}
