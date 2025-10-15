export class HttpResult {
    private static buildError(...messages: string[]) {
        return { errors: messages.map(message => ({ message: message })) };
    }

    public static serverError(message?: string): Response {
        const errors = message ? this.buildError(message) : [{ message: 'Internal Server Error' }];
        return Response.json({ errors }, { status: 500 });
    }

    public static unauthorized(): Response {
        return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    public static ok(data?: any): Response {
        return Response.json(data ?? {}, { status: 200 });
    }

    public static noContent(): Response {
        return new Response(null, { status: 204 });
    }
}
