import requests
import json
import time
import os
from django.conf import settings

genres = {
    "Fantasy": [
        "The Hobbit", "Harry Potter and the Sorcerer's Stone", "The Name of the Wind", "A Game of Thrones", 
        "Mistborn", "The Way of Kings", "Eragon", "The Final Empire", "The Lies of Locke Lamora", 
        "The Eye of the World", "The Golden Compass", "The Magicians", "Uprooted", "The Priory of the Orange Tree", 
        "Jonathan Strange & Mr Norrell", "The Once and Future King", "Throne of Glass", "A Court of Thorns and Roses", 
        "The Cruel Prince", "Red Queen", "Shadow and Bone", "An Ember in the Ashes", "Children of Blood and Bone", 
        "Six of Crows", "Crooked Kingdom", "City of Bones", "Clockwork Angel", "The House in the Cerulean Sea", 
        "Legends & Lattes", "Neverwhere", "Good Omens", "American Gods", "The Night Circus", "The Ocean at the End of the Lane", 
        "Stardust", "The Paper Magician", "The Bear and the Nightingale", "Spinning Silver", "The Girl Who Drank the Moon", 
        "The Witcher: The Last Wish", "Blood of Elves", "The Blade Itself", "Assassin's Apprentice", "Royal Assassin", 
        "The Wise Man's Fear", "Elantris", "Warbreaker", "The Alloy of Law", "The Bands of Mourning", "Steelheart", 
        "Firefight", "Calamity", "Skyward", "Starsight", "Cytonic", "Tress of the Emerald Sea", "Yumi and the Nightmare Painter", 
        "The Frugal Wizard’s Handbook", "Fourth Wing"
    ],
    "Romance": [
        "Pride and Prejudice", "The Notebook", "The Fault in Our Stars", "Twilight", "Outlander", "The Rosie Project", 
        "Me Before You", "Anna Karenina", "Bridget Jones's Diary", "The Hating Game", "The Wedding Date", 
        "It Ends with Us", "The Kiss Quotient", "Red, White & Royal Blue", "The Deal", "Fifty Shades of Grey", 
        "A Court of Thorns and Roses", "The Time Traveler's Wife", "The Wedding Planner", "Beach Read", 
        "The Bromance Book Club", "The Flatshare", "The Seven Husbands of Evelyn Hugo", "To All the Boys I've Loved Before", 
        "The Unhoneymooners", "Love, Rosie", "Ugly Love", "Beautiful Disaster", "Slammed", "The Duke and I", 
        "Rogue", "Lucky in Love", "The Perfect Hope", "Maybe in Another Life", "The Sun Down Motel", 
        "Jude's Law", "Love & Gelato", "Forever and Always", "Book Lovers", "The Kiss of Deception", 
        "This Man", "Lucky You", "The Secret History of Us", "An Offer You Can't Refuse", "Sweet Filthy Boy", 
        "The One That Got Away", "A Walk to Remember", "Before We Were Strangers", "The Penderwicks", 
        "Finding Cinderella", "The Pact", "Chasing Red", "Falling into You", "The Nightingale", "The Longest Ride"
    ],
    "Mystery": [
        "The Girl with the Dragon Tattoo", "Gone Girl", "Big Little Lies", "The Silent Patient", "In the Woods", 
        "Sharp Objects", "The Woman in the Window", "The Couple Next Door", "The Girl on the Train", 
        "Before I Go to Sleep", "The Cuckoo's Calling", "And Then There Were None", "The Reversal", "I Am Watching You", 
        "The 5th Wave", "The Girl Who Lived", "Anatomy of a Murder", "The Woman in Cabin 10", "Rebecca", "The Outsider", 
        "The Guest List", "Dark Places", "The Wife Between Us", "The Girl in the Spider's Web", 
        "The Couple Next Door", "No Time for Goodbye", "I Am Watching You", "The Lying Game", "The Chain", 
        "The Vanishing Year", "One of Us Is Lying", "The Girl on the Train", "Sharp Objects", "The Couple Next Door", 
        "The Other Woman", "The Last Time I Lied", "The Secret History", "In a Dark, Dark Wood", "Behind Closed Doors", 
        "The Girl in the Green Sweater", "The Silent Corner", "The Woman in the Window", "The Plot", "The Night She Disappeared", 
        "The Death of Mrs. Westaway", "The Girl Who Smiled Beads", "Tana French", "Eleanor Oliphant is Completely Fine"
    ],
    "Science Fiction": [
        "Dune", "Ender's Game", "The Left Hand of Darkness", "Neuromancer", "Hyperion", "The Three-Body Problem", 
        "Snow Crash", "The Hunger Games", "The Martian", "Brave New World", "1984", "The Handmaid's Tale", 
        "The Forever War", "Altered Carbon", "Red Mars", "The Dispossessed", "Fahrenheit 451", "The Stars My Destination", 
        "The Expanse Series", "The Moon is a Harsh Mistress", "I Am Legend", "The Invisible Man", "The Road", 
        "A Canticle for Leibowitz", "The Windup Girl", "The Diamond Age", "Foundation", "I, Robot", "Ringworld", 
        "The Left Hand of Darkness", "The Long Way to a Small, Angry Planet", "The Giver", "The Space Between Worlds", 
        "All Systems Red", "The Goliath Stone", "A Fire Upon the Deep", "Blindsight", "The Broken Earth Trilogy", 
        "The Calculating Stars", "The Martian Chronicles", "The City & the City", "The Dark Forest", "The Fated Sky", 
        "Leviathan Wakes", "The Moonstone", "The Night’s Dawn Trilogy", "Children of Time", "Borne", "The Caves of Steel", 
        "The Hitchhiker’s Guide to the Galaxy", "Anthem", "Siddhartha", "Cryptonomicon", "The Giver", "The Quantum Thief"
    ],
    "Historical Fiction": [
        "The Book Thief", "All the Light We Cannot See", "The Nightingale", "The Help", "The Pillars of the Earth", 
        "Water for Elephants", "Atonement", "The Alice Network", "The Night Watch", "The Tattooist of Auschwitz", 
        "The Paris Library", "The Orphan's Tale", "Where the Crawdads Sing", "The Guernsey Literary and Potato Peel Pie Society", 
        "The Other Boleyn Girl", "The Paris Architect", "Atonement", "The Things They Carried", "The Light Between Oceans", 
        "The Red Tent", "The Song of Achilles", "The Goldfinch", "The Invisible Bridge", "The Tea Girl of Hummingbird Lane", 
        "The Orphan's Song", "The Zookeeper's Wife", "Memoirs of a Geisha", "The Help", "The Immortalists", 
        "The Nightingale", "The Other Woman", "The Shadow of the Wind", "The Book Thief", "Big Little Lies", 
        "The Night Watch", "The Last Battle", "The Great Alone", "The Book Thief", "The Tea Girl of Hummingbird Lane", 
        "The Woman in the Window", "The Tattooist of Auschwitz", "The Paris Architect", "The Night Manager", 
        "Atonement", "The Shadow of the Wind", "The Paris Library", "The Nightingale", "The Black Prism", 
        "The Red Tent", "The Hidden Life of Trees", "The Book Thief", "The Light Between Oceans"
    ],
    "Thriller": [
        "The Girl with the Dragon Tattoo", "The Silent Patient", "Gone Girl", "The Couple Next Door", "Big Little Lies", 
        "Sharp Objects", "The Woman in the Window", "Before I Go to Sleep", "The Girl on the Train", "The Cuckoo's Calling", 
        "In the Woods", "The Girl Who Lived", "Anatomy of a Murder", "The Woman in Cabin 10", "The Outsider", 
        "The Night She Disappeared", "The Guest List", "The Chain", "Behind Closed Doors", "The Secret History", 
        "The Lying Game", "The Reversal", "One of Us Is Lying", "The Plot", "The Death of Mrs. Westaway", 
        "The Wife Between Us", "The Other Woman", "The Night Manager", "The Vanishing Year", "The Girl in the Green Sweater", 
        "I Am Watching You", "The Secret History", "The Couple Next Door", "The Girl Who Smiled Beads", 
        "The Woman in the Window", "Dark Places", "The Silent Corner", "The Girl in the Spider's Web", "The Last Time I Lied", 
        "The Death of Mrs. Westaway", "The Girl in Cabin 10", "The 5th Wave", "The Chain", "The Girl Who Lived", 
        "The Silent Corner", "I Am Watching You", "The Couple Next Door", "The Girl with the Dragon Tattoo"
    ],
    "Horror": [
        "It", "The Shining", "The Haunting of Hill House", "Dracula", "Frankenstein", "The Exorcist", "Bird Box", 
        "Pet Sematary", "World War Z", "The Silence of the Lambs", "The Institute", "Carrie", "The Stand", "House of Leaves", 
        "The Cabin at the End of the World", "The Girl Next Door", "The Terror", "The Mist", "Rising Tide", 
        "The Walking Dead", "House of the Scorpion", "The Road", "The Whisper Man", "The Troop", "The Dead Zone", 
        "The Bone Clocks", "The Ruins", "American Psycho", "The Outsider", "The Witches", "Horns", "Scary Stories to Tell in the Dark", 
        "The Girl in the Road", "The Turn of the Screw", "The Call of Cthulhu", "Misery", "Red Dragon", "The Fisherman", 
        "The Butterfly Garden", "The Girl with All the Gifts", "The Night Swim", "Sharp Objects", "The Little Stranger", 
        "The Hound of the Baskervilles", "Ghost Story", "The Shadows", "Dark Places", "Salem's Lot", "The Strain", 
        "Bird Box", "Reborn", "The Final Girls", "The Hollow Places"
    ],
        "Young Adult (YA)": [
        "The Fault in Our Stars", "The Hunger Games", "Divergent", "Looking for Alaska", "Eleanor & Park", 
        "The Hate U Give", "The Perks of Being a Wallflower", "Thirteen Reasons Why", "We Were Liars", 
        "The Book Thief", "The Maze Runner", "To All the Boys I've Loved Before", "The Gilded Wolves", 
        "Six of Crows", "A Court of Thorns and Roses", "Red Queen", "The Cruel Prince", "Everything, Everything", 
        "The Selection", "The Ballad of Songbirds and Snakes", "The Midnight Library", "The Wrath & the Dawn", 
        "A Good Girl's Guide to Murder", "One of Us Is Lying", "The Simon Spier Series", "Before I Fall", 
        "The Night Circus", "Scythe", "Wings of Fire", "The Wicked King", "Cinder", "An Ember in the Ashes", 
        "Children of Blood and Bone", "Legend", "Carve the Mark", "Serpent & Dove", "Truthwitch", "Graceling", 
        "The Hate U Give", "Everything Everything", "Miss Peregrine's Home for Peculiar Children", 
        "The Maze Runner", "The Lunar Chronicles", "Leah on the Offbeat", "The Summer I Turned Pretty", 
        "Simon vs. the Homo Sapiens Agenda", "Shatter Me", "The Raven Boys", "The Outsiders", "Turtles All the Way Down"
    ],
        "Children's Books": [
        "Where the Wild Things Are", "The Very Hungry Caterpillar", "The Cat in the Hat", "Goodnight Moon", 
        "Harry Potter and the Sorcerer's Stone", "The Gruffalo", "The Tale of Peter Rabbit", "Charlotte's Web", 
        "Winnie-the-Pooh", "The Lion, the Witch, and the Wardrobe", "Matilda", "Alice's Adventures in Wonderland", 
        "The Wind in the Willows", "The Chronicles of Narnia", "The Snowy Day", "How the Grinch Stole Christmas", 
        "The Secret Garden", "James and the Giant Peach", "Anne of Green Gables", "Pippi Longstocking", 
        "The Little Prince", "The Berenstain Bears", "The Phantom Tollbooth", "The Polar Express", "Frog and Toad", 
        "The Pigeon Finds a Hot Dog!", "The Giving Tree", "Cloudy with a Chance of Meatballs", "The Monster at the End of This Book", 
        "Matilda", "The Paper Bag Princess", "The Adventures of Tintin", "Babe: The Gallant Pig", "The Adventures of Winnie the Pooh", 
        "Little House on the Prairie", "The Boxcar Children", "The Amazing Adventures of Kavalier & Clay", "The Magic Treehouse", 
        "The Paper Dolls", "The Owl Who Was Afraid of the Dark", "Little Critter", "The Indian in the Cupboard", 
        "Charlie and the Chocolate Factory", "Puss in Boots", "The Three Little Pigs", "The Napping House", 
        "The Monster's Ring", "The Little Engine That Could", "Cinderella", "The Wonderful Wizard of Oz"
    ],
        "Biography / Memoir": [
        "The Diary of a Young Girl", "Educated", "Becoming", "Steve Jobs", "The Glass Castle", "When Breath Becomes Air", 
        "Into the Wild", "The Long Hard Road", "Night", "I Am Malala", "The Immortal Life of Henrietta Lacks", 
        "Born a Crime", "Wild", "Unbroken", "Open", "The Color of Water", "The Wright Brothers", "The Hiding Place", 
        "The Glass Castle", "The Road to Character", "The Prince of the Marshes", "A Life Well Played", "The Woman Who Smashed Codes", 
        "The Last Lecture", "My Beloved World", "One Last Thing", "A Heartbreaking Work of Staggering Genius", 
        "The Last Black Unicorn", "The Paris Wife", "A Man Called Ove", "The Art of Happiness", "The Boys in the Boat", 
        "The Outsider", "This Is Me", "A Year in the Life of a Year", "Yes Please", "The Autobiography of Malcolm X", 
        "The Emperor of All Maladies", "On Writing", "The Soul of an Octopus", "Bossypants", "The Price of Illusion", 
        "The Sun and Her Flowers", "The Rise of Theodore Roosevelt", "Grayson", "The Cuckoo's Calling", "Running with Scissors", 
        "The Power of Habit", "The Ocean at the End of the Lane", "Just as I Am", "The Snow Child"
    ],
        "Self-Help": [
        "Atomic Habits", "The Power of Now", "The Subtle Art of Not Giving a F*ck", "You Are a Badass", "Dare to Lead", 
        "How to Win Friends and Influence People", "The Four Agreements", "The Seven Habits of Highly Effective People", 
        "The Gifts of Imperfection", "Think and Grow Rich", "Grit", "The Life-Changing Magic of Tidying Up", "Mindset", 
        "The Miracle Morning", "The Happiness Project", "The 5 AM Club", "The Untethered Soul", "Start with Why", 
        "The 5 Love Languages", "The Power of Positive Thinking", "Brené Brown", "You Can Heal Your Life", 
        "Rich Dad Poor Dad", "The Compound Effect", "The Art of Happiness", "The Magic", "The Lean Startup", "The Confidence Code", 
        "Self-Compassion", "The War of Art", "The Secret", "The One Thing", "The Art of Thinking Clearly", "Unf*ck Yourself", 
        "The Secret to Success", "The Mastery of Love", "Atomic Habits", "Radical Acceptance", "The Power of Vulnerability", 
        "The High 5 Habit", "Love Yourself Like Your Life Depends on It", "Everything Is F*cked", "Deep Work", "Awaken the Giant Within"
    ],
        "Graphic Novels": [
        "Watchmen", "Maus", "Persepolis", "The Sandman", "V for Vendetta", "The Walking Dead", "Y: The Last Man", 
        "Saga", "Bone", "Scott Pilgrim vs. The World", "Marvels", "Sandman: Preludes and Nocturnes", "The Killing Joke", 
        "Sin City", "Locke & Key", "Transmetropolitan", "Astro City", "The League of Extraordinary Gentlemen", 
        "Ms. Marvel", "The Umbrella Academy", "The Dark Knight Returns", "Wonder Woman: The Hiketeia", "Invincible", 
        "Black Hole", "Fables", "The Arrival", "The Tale of One Bad Rat", "The Crow", "Mister X", "Blacksad", "The Invisibles", 
        "Spider-Man: The Death of Jean DeWolff", "The Unwritten", "The Ghost in the Shell", "Tank Girl", 
        "American Vampire", "Batgirl: Year One", "The Walking Dead Compendium", "The Boys", "Y: The Last Man", 
        "American Born Chinese", "Wicked + Divine", "Deadpool", "Star Wars: Thrawn Trilogy", "Teen Titans: The Judas Contract", 
        "Batman: Hush", "The Man Who Falls", "Giant Days", "The Wicked + The Divine", "Watchmen: Deluxe Edition"
    ],
        "Contemporary Fiction": [
        "Normal People", "The Night Circus", "The Goldfinch", "A Little Life", "The Rosie Project", "The Art of Racing in the Rain", 
        "Where'd You Go, Bernadette", "Big Little Lies", "Little Fires Everywhere", "An American Marriage", "Circe", 
        "The Light We Lost", "The Seven Husbands of Evelyn Hugo", "The Midnight Library", "The Song of Achilles", 
        "Before We Were Strangers", "Me Before You", "Eleanor Oliphant Is Completely Fine", "The Nightingale", "The Book Thief", 
        "The Night Watchman", "A Man Called Ove", "All the Light We Cannot See", "The Tattooist of Auschwitz", 
        "The Help", "The Family Upstairs", "The Silent Patient", "The Woman in the Window", "American Dirt", "The Couple Next Door", 
        "The Turn of the Key", "The Hating Game", "Verity", "Room", "The Flatshare", "One Day", "The 5th Wave", "The Secret History", 
        "The Ocean at the End of the Lane", "Homegoing", "The Underground Railroad", "The Alice Network", "In Five Years", 
        "The Giver of Stars", "The Henna Artist", "The Paris Library", "The Four Winds", "The Love Hypothesis", "All We Ever Wanted"
    ],
        "Classic Literature": [
        "Pride and Prejudice", "1984", "The Great Gatsby", "Moby Dick", "Wuthering Heights", "Jane Eyre", "Crime and Punishment", 
        "War and Peace", "The Catcher in the Rye", "Frankenstein", "Brave New World", "The Odyssey", "Anna Karenina", 
        "The Scarlet Letter", "Les Misérables", "The Brothers Karamazov", "The Picture of Dorian Gray", 
        "Dracula", "Ulysses", "The Canterbury Tales", "The Divine Comedy", "Fahrenheit 451", "The Old Man and the Sea", 
        "The Grapes of Wrath", "The Great Expectations", "To Kill a Mockingbird", "A Tale of Two Cities", "Siddhartha", 
        "The Sun Also Rises", "Heart of Darkness", "The Stranger", "Don Quixote", "The Call of the Wild", "The Jungle", 
        "The Hobbit", "The Invisible Man", "The Hound of the Baskervilles", "A Passage to India", "The Metamorphosis", 
        "The Lord of the Rings", "Tess of the d'Urbervilles", "Gulliver's Travels", "The Count of Monte Cristo", "The Trial", 
        "The Age of Innocence", "The Grapes of Wrath", "The War of the Worlds", "The Catcher in the Rye", "The Road", 
        "Dr. Jekyll and Mr. Hyde", "The Bell Jar", "The Woman in White"
    ],
        "Adventure": [
        "The Hobbit", "Treasure Island", "Moby Dick", "Journey to the Center of the Earth", "The Call of the Wild", 
        "The Adventures of Tom Sawyer", "The Three Musketeers", "Around the World in 80 Days", "The Lost World", 
        "Robinson Crusoe", "The Jungle Book", "King Solomon's Mines", "The Secret Garden", "The Swiss Family Robinson", 
        "The Pirates of the Caribbean", "The Odyssey", "The Mysterious Island", "The Wind in the Willows", 
        "The Adventures of Sherlock Holmes", "Into the Wild", "The Girl Who Lived", "Life of Pi", "The Lightning Thief", 
        "The Maze Runner", "The Hunger Games", "Harry Potter and the Sorcerer's Stone", "The Alchemist", "The Night Circus", 
        "The City of Ember", "Ender's Game", "The Golden Compass", "The Giver", "Dune", "The Lord of the Rings", 
        "The Sea of Monsters", "Percy Jackson", "I Am Legend", "The Road", "Into the Heart of the Sea", "A Walk in the Woods", 
        "The Princess Bride", "The Story of the Treasure Seekers", "Hatchet", "The Call of Cthulhu", "The Mummy", "A Walk in the Woods", 
        "The Hunt for Red October", "The Thin Man", "The Princess Bride", "Cloud Atlas"
    ],
        "Dystopian": [
        "1984", "Brave New World", "Fahrenheit 451", "The Hunger Games", "The Maze Runner", "The Handmaid's Tale", 
        "Divergent", "The Giver", "The Road", "Red Rising", "The Knife of Never Letting Go", "Station Eleven", "V for Vendetta", 
        "Cloud Atlas", "Children of Men", "The Water Knife", "The Power", "The 5th Wave", "Oryx and Crake", "The Windup Girl", 
        "The Man in the High Castle", "The Parable of the Sower", "Snowpiercer", "The 100", "The Forest of Hands and Teeth", 
        "Never Let Me Go", "The Girl with All the Gifts", "The Giver of Stars", "The Silent Stars Go By", "The Book of M", 
        "The Chrysalids", "A Clockwork Orange", "The Knife of Never Letting Go", "The Children of Blood and Bone", 
        "The Hunger Games: Catching Fire", "Brave New World Revisited", "The Gate to Women's Country", "The Long Way to a Small, Angry Planet", 
        "The Darkest Minds", "The Shining Girls", "Altered Carbon", "The Underground Railroad", "The Forever War", 
        "The Forever War", "The Blinding Knife", "Station Eleven", "The Water Knife", "The Girl with the Louding Voice", 
        "The Stand", "The Long Earth", "The City of Ember", "The Drowned Cities", "The Last Book of the Earth", "The Death Cure"
    ],
        "Poetry": [
        "The Waste Land", "Milk and Honey", "The Sun and Her Flowers", "Ariel", "The Raven", "The Love Song of J. Alfred Prufrock", 
        "The Prophet", "The Iliad", "The Odyssey", "Odes", "Song of Myself", "The Canterbury Tales", "The Aeneid", 
        "Leaves of Grass", "The Divine Comedy", "The Road Not Taken", "Selected Poems", "The Poems of W.B. Yeats", 
        "The Essential Rumi", "The Odyssey", "The Poems of Emily Dickinson", "Sappho: A New Translation", "Poems of William Blake", 
        "The Colossus", "Fables", "The Lamentations of Jeremiah", "The Ballad of Reading Gaol", "The Seven Ages of Man", 
        "The Penguin Anthology of Twentieth-Century American Poetry", "The Complete Poems of Anne Sexton", "Pride of the Peacock", 
        "The Waste Land: A Facsimile and Transcript of the Original Drafts", "A Poetry Handbook", "The Book of Disquiet", 
        "A Field Guide to the English Countrywoman", "The Penguin Anthology of Classic American Literature", 
        "Selected Poems of John Keats", "The Darkling Thrush", "A Little Book of Life", "The Bedside Book of Famous Poems", 
        "The Oxford Book of English Verse", "The Selected Poems of Emily Dickinson", "The Poems of Rainer Maria Rilke", 
        "The Sonnets of William Shakespeare", "The Adventures of Sherlock Holmes", "Howl and Other Poems", "The Best Poems of 2000", 
        "Raining Frogs and Other Poems", "The Poetry of Robert Frost", "The Golden Treasury of English Verse", 
        "The Essential Poems of T.S. Eliot"
    ],
        "Non-fiction": [
        "Sapiens: A Brief History of Humankind", "Educated", "Becoming", "The Immortal Life of Henrietta Lacks", 
        "The Diary of a Young Girl", "The Wright Brothers", "The Glass Castle", "Into the Wild", "The Devil in the White City", 
        "The Power of Habit", "Quiet: The Power of Introverts in a World That Can't Stop Talking", "Outliers", 
        "The Subtle Art of Not Giving a F*ck", "Unbroken", "Thinking, Fast and Slow", "The Art of War", "A Brief History of Time", 
        "The Gene: An Intimate History", "Blink: The Power of Thinking Without Thinking", "Educated: A Memoir", 
        "The Art of Happiness", "The Omnivore's Dilemma", "The Autobiography of Malcolm X", "Into the Wild", "Man's Search for Meaning", 
        "Freakonomics", "The 5 AM Club", "Atomic Habits", "How to Win Friends and Influence People", "A Short History of Nearly Everything", 
        "The Richest Man in Babylon", "The Power of Now", "Grit: The Power of Passion and Perseverance", "The Happiness Project", 
        "Daring Greatly", "The Art of Thinking Clearly", "On Writing: A Memoir of the Craft", "The 48 Laws of Power", 
        "The Happiness Hypothesis", "Meditations", "The Wisdom of Insecurity", "The Four Agreements", "You Are a Badass", 
        "Educated", "The Men Who Built America", "When Breath Becomes Air", "The Complete Works of William Shakespeare", 
        "The Seven Habits of Highly Effective People", "The Motivation Manifesto", "The Power of Positive Thinking", 
        "How to Stop Worrying and Start Living", "Dare to Lead", "The Daily Stoic", "Mindset: The New Psychology of Success"
    ],
        "Spirituality / Religion": [
        "The Power of Now", "The Bible", "The Tao Te Ching", "A New Earth", "The Bhagavad Gita", "The Book of Awakening", 
        "The Seven Spiritual Laws of Success", "The Celestine Prophecy", "The Art of Happiness", "The Four Agreements", 
        "Siddhartha", "The Alchemist", "The Wisdom of Insecurity", "The Book of Mormon", "The Teachings of Don Juan", 
        "The Science of Mind", "The Secret", "The Dhammapada", "The Life-Changing Magic of Tidying Up", "The Heart of the Buddha's Teaching", 
        "Awakening the Buddha Within", "The Yoga Sutras of Patanjali", "The Untethered Soul", "The Art of Loving", "Tao of Pooh", 
        "The Way of the Peaceful Warrior", "The Case for Christ", "The Book of Joy", "The Universe Has Your Back", 
        "The Power of Intention", "The Road Less Traveled", "The Tao of Physics", "The Teachings of the Buddha", 
        "The Miracle of Mindfulness", "The Prophet", "The Power of Prayer", "The Big Book of Alcoholics Anonymous", 
        "The Second Mountain", "The Autobiography of a Yogi", "Anatomy of the Spirit", "Buddha's Brain", 
        "The Divine Matrix", "The Magic of Believing", "The Seat of the Soul", "In the Flow", "A Return to Love", 
        "The Happiness Project", "The Wisdom of Life", "The Essential Rumi", "The Book of Life", "Radical Acceptance"
    ],
        "Humor / Comedy": [
        "Bossypants", "Yes Please", "The Hitchhiker's Guide to the Galaxy", "Catch-22", "Good Omens", "The Dry", 
        "A Confederacy of Dunces", "Is Everyone Hanging Out Without Me?", "The Importance of Being Earnest", "The Diary of a Wimpy Kid", 
        "The Ellen DeGeneres Show", "I Feel Bad About My Neck", "Me Talk Pretty One Day", "The Girl with the Lower Back Tattoo", 
        "A Walk in the Woods", "Furiously Happy", "The Worst-Case Scenario Survival Handbook", "The Pleasure of My Company", 
        "Why Not Me?", "The Subtle Art of Not Giving a F*ck", "The Naked Sun", "My Squirrel Days", "Super Sad True Love Story", 
        "The Bitch Is Back", "Let's Pretend This Never Happened", "The Idiot", "The Secret Diary of Hendrik Groen", 
        "How to Be a Woman", "The Book of Mormon", "The 5th Wave", "You'll Grow Out of It", "I Can't Make This Up", 
        "Sisterhood Everlasting", "The Rosie Project", "The Princess Bride", "Lamb: The Gospel According to Biff, Christ's Childhood Pal", 
        "When Breath Becomes Air", "The Egg and I", "Do I Make Myself Clear?", "I'm Judging You", "Let's Explore Diabetes with Owls", 
        "Life After Life", "The Secret Life of Bees", "The Help", "A Spool of Blue Thread", "Crazy Rich Asians", 
        "Fates and Furies", "Big Little Lies", "The Fault in Our Stars", "The Curious Incident of the Dog in the Night-Time", 
        "Sh*t My Dad Says", "Me Before You", "An Abundance of Katherines"
    ]
}

def fetch_book_details(title):
    url = f"https://www.googleapis.com/books/v1/volumes?q=intitle:{title}&key={settings.GOOGLE_BOOKS_API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        items = response.json().get("items")
        if items:
            volume_info = items[0].get("volumeInfo", {})
            title = volume_info.get("title")
            authors = volume_info.get("authors", ["Unknown"])
            image_links = volume_info.get("imageLinks", {})
            thumbnail = image_links.get("thumbnail", "")
            return {
                "title": title,
                "author": authors[0],
                "cover": thumbnail
            }
    return None

def process_genres(genres):
    result = {}
    for genre, titles in genres.items():
        print(f"Processing genre: {genre}")
        books = []
        for title in titles:
            print(f"Fetching details for: {title}")
            details = fetch_book_details(title)
            if details:
                books.append(details)
            time.sleep(1)  # To respect API rate limits
        result[genre] = books
    return result

if __name__ == "__main__":
    data = process_genres(genres)
    with open(os.path.join(os.path.dirname(__file__), 'genres.json'), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print("Data saved to genres.json")
