# Editing the JTCC website

Hi Kristi — this is everything you need. No software to install, nothing to download. Works from a laptop, iPad, or phone.

All the words on the site live in one file. You open it in your browser, type over what you want to change, click a green button. The site updates itself about a minute later.

---

## First time only

You need a free GitHub account, and Cody adds you to the site.

1. Make an account at **[github.com](https://github.com)**
2. Send Cody your username
3. He adds you — he'll go to the repo, then Settings → Collaborators → Add people
4. Accept the invite in your email

That's it. Never again.

---

## Making a change

**1. Open the file**

Go to **[github.com/hellocodyux/jtcc-site](https://github.com/hellocodyux/jtcc-site)**

Click **`src`**, then **`content`**, then **`content.json`**

You'll see the site's words in a long list.

**2. Click the pencil**

Top right of the file. The ✏️ icon. Now you can type.

**3. Change the words**

Everything looks like this:

```
"headline": "Good food. Better company.",
```

The left part (`"headline"`) is a label — leave it alone.
The right part is what shows on the site — change that.

Use **⌘F** to search for the text you want to find.

**4. Save**

Scroll to the bottom. Write a quick note about what you changed. Click the green **Commit changes** button.

**5. Wait a minute**

Refresh the site. Your change is there.

---

## Four rules

1. Only change text **between quotation marks**
2. Don't remove commas, brackets, or braces
3. Don't rename the labels on the left
4. Apostrophes are fine — a `"` inside your text will break it, use `'` instead

---

## You can't break the site

If an edit has a mistake, the update just doesn't go through and the site keeps showing the current version. Nothing goes down. Nothing gets lost.

If a change doesn't appear after a couple of minutes, that's what happened. Tell Cody, or click **History** at the top of the file to see what changed.

---

## What you can edit here

- Hero headline and subtitle
- The "Everybody eats" paragraphs
- Service names and descriptions
- Photo captions
- Testimonials — quotes and names
- Contact heading and email
- Footer tagline
- Google search title and description

**Ask Cody for:** new photos, colors, fonts, layout, adding or removing sections.

---

## Want him to check it first?

For bigger rewrites, at step 4 choose **"Create a new branch for this commit and start a pull request"** instead of committing directly.

That saves your version privately and generates a preview link for Cody to look at before it goes live. Good for a full rewrite of a section. Overkill for a typo.

---

## The whole thing in five steps

1. github.com/hellocodyux/jtcc-site → `src` → `content` → `content.json`
2. Pencil icon
3. Type
4. Green **Commit changes** button
5. Wait a minute

That's all of it.
