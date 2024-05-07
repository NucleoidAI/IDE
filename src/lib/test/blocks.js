export const blocks = [
  "'use declarative';\n\nclass User {\n firstName: string;\n lastName: string;\n\n constructor(firstName: string, lastName: string) {\n this.firstName = firstName;\n this.lastName = lastName;\n }\n}",
  "'use declarative';\n\n$User.fullName = $User.firstName + ' ' + $User.lastName;",
  "'use declarative';\n\n$User.initials = $User.firstName.charAt(0) + $User.lastName.charAt(0);",
  "'use imperative';\n\nUser.filter(u => u.lastName === 'Doe');",
];
