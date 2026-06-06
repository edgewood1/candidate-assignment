added responsive layout for phones & loading spinner/notFound message

- added layout for phone
  d163dc2 add a debouncer + non-responsive styling + prettier + decoupled searchbar
- adding some basic styling was a quick win
- removed the jsx for the searchbar to simplify this page
- i intend to remove more parts
  57350f8 add debouncer to prevent excessive filtering
- added the debouncer to prevent excessive rendering/filtering
- i was also thinking about the situation of having a large data-set
- i likely removed the search button since it seemed redundant to have both.
- i like the immediacy of the onChange
  856e547 fixed search and removed api/debug
- fixed the search bug so that I could see what I was working with.
  473fe9b Add application code
  d2927d5 Add documentation
  ecc6607 Add project configuration files
