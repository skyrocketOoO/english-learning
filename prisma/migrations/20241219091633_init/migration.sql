-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserTestRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "wordId" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "correctTimes" INTEGER NOT NULL DEFAULT 0,
    "testedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserTestRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserTestRecord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserTestRecord" ("id", "isCorrect", "testedAt", "userId", "wordId") SELECT "id", "isCorrect", "testedAt", "userId", "wordId" FROM "UserTestRecord";
DROP TABLE "UserTestRecord";
ALTER TABLE "new_UserTestRecord" RENAME TO "UserTestRecord";
CREATE UNIQUE INDEX "UserTestRecord_userId_wordId_key" ON "UserTestRecord"("userId", "wordId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
