import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
});

export default client;

//Ten kod tworzy i konfiguruje klienta Apollo, który służy do komunikacji z backendem GraphQL.
// Dzięki niemu aplikacja React może wysyłać zapytania i mutacje oraz zarządzać lokalnym cachem danych.
// Jest to część integracji GraphQL w architekturze frontendu.