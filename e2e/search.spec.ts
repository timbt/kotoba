import { expect, test } from "@playwright/test";

// The app is served at /kotoba/ (Vite base) and uses HashRouter,
// so routes are at /kotoba/#/search/... and /kotoba/#/kanji/...
// We intercept GraphQL requests to avoid depending on the real external API.

const API_URL = "https://kotoba-api-k0iy.onrender.com/graphql/";

const mockKanji = {
  literal: "猫",
  readings_on: ["ビョウ"],
  readings_kun: ["ねこ"],
  meanings: ["cat"],
};

test.beforeEach(async ({ page }) => {
  await page.route(API_URL, async (route) => {
    const body = route.request().postDataJSON();

    if (body.operationName === "getSearchResults") {
      await route.fulfill({
        json: {
          data: {
            search: {
              search_query: body.variables.searchQuery,
              kanji: [mockKanji],
            },
          },
        },
      });
    } else if (body.operationName === "GetKanji") {
      const kanji = body.variables.literal === "猫" ? mockKanji : null;
      await route.fulfill({ json: { data: { kanji } } });
    } else {
      await route.continue();
    }
  });
});

test("search flow: typing a query shows results", async ({ page }) => {
  await page.goto("/kotoba/#/");
  await page.getByRole("textbox").fill("cat");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page).toHaveURL(/#\/search\/cat/);
  await expect(page.getByText(/Searched for "cat"/)).toBeVisible();
  await expect(page.getByRole("button", { name: /猫/ })).toBeVisible();
});

test("kanji detail flow: clicking a result navigates to detail page", async ({
  page,
}) => {
  await page.goto("/kotoba/#/search/cat");

  await page.getByRole("button", { name: /猫/ }).click();

  // 猫 is URL-encoded as %E7%8C%AB in the browser address bar
  await expect(page).toHaveURL(/#\/kanji\//);
  await expect(page.getByText("ねこ")).toBeVisible();
  await expect(page.getByText("ビョウ")).toBeVisible();
  await expect(page.getByText("cat")).toBeVisible();
});

test("empty search: submitting empty input does not navigate", async ({
  page,
}) => {
  await page.goto("/kotoba/#/");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page).toHaveURL("/kotoba/#/");
});

test("no results: shows zero results message", async ({ page }) => {
  await page.route(API_URL, async (route) => {
    await route.fulfill({
      json: {
        data: {
          search: { search_query: "xyz", kanji: [] },
        },
      },
    });
  });

  await page.goto("/kotoba/#/search/xyz");
  await expect(
    page.getByRole("heading", { level: 3, name: /0 results found/ }),
  ).toBeVisible();
});
