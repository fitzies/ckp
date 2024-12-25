import prisma from "./prisma";

async function getAllCompanies() {
  return await prisma.company.findMany();
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
  borrowerData: { name: string; maskedNric: string }
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
  return await prisma.key.update({
    where: { id: keyId },
    data: { borrowerId: borrower.maskedNric },
  });
}

async function returnKey(keyId: string) {
  return await prisma.key.update({
    where: { id: keyId },
    data: { borrowerId: null }, // Disconnect the key from the borrower
  });
}

export {
  getAllCompanies,
  getCompany,
  createKey,
  deleteKey,
  borrowKey,
  returnKey,
};
