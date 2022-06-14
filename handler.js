const books = require("./books");
const { nanoid } = require('nanoid'); 
const { response } = require("@hapi/hapi/lib/validation");

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, reading, insertedAt, updatedAt, finished
    };
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    } else if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const response = h.response({
        status: 'success',
        data: { books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
        }))},
    });
    console.log(books);
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((b) => b.id === bookId)[0];

    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book
            }
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    };
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;
    };
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

//OPTIONAL CASE HANDLER

const getAllBooksControllers = (request, h) => {
    const { name, reading, finished } = request.query;

    if (name) {
        const filter = books.filter((q) => q.name.toLowerCase().includes(name.toLowerCase()));
        const response = h.response({
            status: 'success',
            data: {
                books: filter.map((q) => ({
                    id: q.id,
                    name: q.name,
                    publisher: q.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }
    if (reading) {
        if (reading === '0') {
            const filter = books.filter((q) => q.reading === false);
            const response = h.response({
                status: 'success',
                data: {
                    books: filter.map((q) => ({
                        id: q.id,
                        name: q.name,
                        publisher: q.publisher,
                    })),
                },
            });
            response.code(200);
            return response;
        }
        if (reading === '1') {
            const filter = books.filter((q) => q.reading === true);
            const response = h.response({
                status: 'success',
                data: {
                    books: filter.map((q) => ({
                        id: q.id,
                        name: q.name,
                        publisher: q.publisher,
                    })),
                },
            });
            response.code(200);
            return response;
        }
    }
    if (finished) {
        if (finished === '0') {
            const filter = books.filter((q) => q.finished === false);
            const response = h.response({
                status: 'success',
                data: {
                    books: filter.map((q) => ({
                        id: q.id,
                        name: q.name,
                        publisher: q.publisher,
                    })),
                },
            });
            response.code(200);
            return response;
        }
        if (finished === '1') {
            const filter = books.filter((q) => q.finished === true);
            const response = h.response({
                status: 'success',
                data: {
                    books: filter.map((q) => ({
                        id: q.id,
                        name: q.name,
                        publisher: q.publisher,
                    })),
                },
            });
            response.code(200);
            return response;
        }
    }
    const response = h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler, getAllBooksControllers };
