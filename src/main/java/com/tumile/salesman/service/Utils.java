package com.tumile.salesman.service;

import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

public class Utils {

    public static final List<String> FFN = List.of("Jackelyn", "Corrine", "Elfreda", "Bebe", "Penny", "Veradis",
        "Nelli", "Bidget", "Cami", "Hailee", "Yetty", "Nelia", "Olive", "Nicholle", "Dalenna", "Nerty", "Silvia",
        "Jacklin", "Brandais", "Leontine", "Lurette", "Karie", "Cassaundra", "Jeannine", "Chastity", "Ophelie",
        "Sadye", "Michel", "Rachele", "Josi", "Tiphany", "Ami", "Agnella", "Zsazsa", "Lolita", "Verene", "Christean",
        "Bernadina", "Edi", "Lucretia", "Vere", "Agatha", "Merrili", "Shaina", "Ulla", "Zorah", "Rea", "Benita",
        "Marrissa", "Elenore");

    public static final List<String> MFN = List.of("Jeffy", "Duane", "Harlin", "Cecilius", "Morgen", "Marcellus",
        "Salmon", "Mal", "Philip", "Antonius", "Sidnee", "Newton", "Wilfred", "Ward", "Cobbie", "Louie", "Nikita",
        "Frannie", "Guido", "Fabio", "Wilmar", "Uri", "Duff", "Izaak", "James", "Panchito", "Merrill", "Horace",
        "Christy", "Ansell", "Ahmed", "Trevor", "Wallace", "Emmy", "Forester", "Shamus", "Noach", "Clemente", "Nappie",
        "Boniface", "Kincaid", "Jon", "Valentino", "Rodolfo", "Hansiain", "Horace", "Bealle", "Merrick", "Kaspar",
        "Bronson");

    public static final List<String> LN = List.of("Templeton", "Tye", "Seyler", "Cockings", "Lampel", "Butchers",
        "Rigard", "Loache", "Radbourn", "Stack", "Sandwith", "Hurring", "Ruslinge", "Trimmill", "Ridolfi", "Rannells",
        "Brundell", "Cheal", "Goldstone", "Tantum", "Gasgarth", "Frapwell", "Harries", "Viner", "Dickie", "Welldrake",
        "Dafforne", "Dulson", "Bayford", "Jennery", "Benediktsson", "Gabala", "Haccleton", "McFadden", "Kahn", "Fass",
        "Horsefield", "Loseby", "Dodman", "Terrans", "Levicount", "Toffler", "D' Angelo", "Bleiman", "Petrelluzzi",
        "Mardy", "Sifleet", "Arghent", "MacDwyer", "Ovens");

    public static Long getPlayerId() {
        return Long.parseLong(SecurityContextHolder.getContext().getAuthentication().getName());
    }
}
