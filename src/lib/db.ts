import prisma from "./prisma";

async function getAllCompanies() {
  return await prisma.company.findMany({ include: { keys: true } });
}

async function getCompany(id: string) {
  return await prisma.company.findUnique({
    where: { id },
    include: { keys: { include: { borrower: true } } },
  });
}

async function createKey(
  name: string,
  numberOfKeys: number,
  companyId: string
) {
  return await prisma.key.create({ data: { name, numberOfKeys, companyId } });
}

async function deleteKey(id: string) {
  return await prisma.key.delete({ where: { id } });
}

async function borrowKey(
  keyId: string,
  borrowerData: { name: string; maskedNric: string },
  companyId: string
) {
  // Upsert the borrower (create if not exists)
  const borrower = await prisma.borrower.upsert({
    where: { maskedNric: borrowerData.maskedNric },
    update: {
      name: borrowerData.name, // Optionally update the name
    },
    create: {
      maskedNric: borrowerData.maskedNric,
      name: borrowerData.name,
    },
  });

  // Update the key to associate it with the borrower
  await prisma.key.update({
    where: { id: keyId },
    data: { borrowerId: borrower.maskedNric },
  });

  // Log the borrow transaction
  await prisma.transaction.create({
    data: {
      borrowerId: borrower.maskedNric,
      companyId,
      keyId,
      action: "BORROWED",
      timestamp: new Date(),
    },
  });
}

async function returnKey(keyId: string, companyId: string, borrowerId: string) {
  // Disconnect the key from the borrower
  await prisma.key.update({
    where: { id: keyId },
    data: { borrowerId: null },
  });

  // Log the return transaction
  await prisma.transaction.create({
    data: {
      borrowerId,
      companyId,
      keyId,
      action: "RETURNED",
      timestamp: new Date(),
    },
  });
}

async function getTransactions(companyId: string) {
  return await prisma.transaction.findMany({
    where: { companyId },
    include: {
      key: true, // Assuming there's a relation to fetch the key name
      borrower: true,
    },
  });
}

export {
  getAllCompanies,
  getCompany,
  createKey,
  deleteKey,
  borrowKey,
  returnKey,
  getTransactions,
};
